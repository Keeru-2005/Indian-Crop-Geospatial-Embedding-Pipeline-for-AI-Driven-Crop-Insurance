import ee
import numpy as np
from datetime import datetime
from dateutil.relativedelta import relativedelta

import os
from dotenv import load_dotenv

load_dotenv()

# ==================================================
# CONFIG
# ==================================================

PROJECT_ID = os.getenv("EE_PROJECT_ID")

try:
    ee.Initialize(project=PROJECT_ID)
except Exception:
    ee.Authenticate()
    ee.Initialize(project=PROJECT_ID)


# ==================================================
# DATE GENERATION
# ==================================================

def monthly_ranges(start_date, end_date):
    start = datetime.strptime(start_date, "%Y-%m-%d")
    end = datetime.strptime(end_date, "%Y-%m-%d")

    ranges = []
    current = start

    while current < end:
        next_month = current + relativedelta(months=1)

        ranges.append(
            (
                current.strftime("%Y-%m-%d"),
                next_month.strftime("%Y-%m-%d")
            )
        )

        current = next_month

    return ranges


# ==================================================
# SINGLE MONTH EXTRACTION
# ==================================================

def get_patch_for_period(
    lat,
    lon,
    start_date,
    end_date,
    patch_size=64
):

    point = ee.Geometry.Point([lon, lat])

    # 64 pixels × 10m resolution
    buffer_distance = (patch_size * 10) / 2

    roi = point.buffer(buffer_distance).bounds()

    # --------------------------------------
    # Sentinel-1
    # --------------------------------------

    s1_collection = (
        ee.ImageCollection("COPERNICUS/S1_GRD")
        .filterBounds(point)
        .filterDate(start_date, end_date)
        .filter(ee.Filter.eq("instrumentMode", "IW"))
        .filter(
            ee.Filter.listContains(
                "transmitterReceiverPolarisation",
                "VV"
            )
        )
        .filter(
            ee.Filter.listContains(
                "transmitterReceiverPolarisation",
                "VH"
            )
        )
    )

    s1_count = s1_collection.size().getInfo()

    if s1_count > 0:
        s1 = (
            s1_collection
            .mean()
            .clip(roi)
        )
    else:
        print(f"Warning: No Sentinel-1 images found for {start_date}. Using no-data placeholder bands.")
        s1 = ee.Image.cat([
            ee.Image.constant(-9999.0).rename("VV"),
            ee.Image.constant(-9999.0).rename("VH")
        ]).clip(roi)

    # --------------------------------------
    # Sentinel-2
    # --------------------------------------

    s2_collection = (
        ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
        .filterBounds(point)
        .filterDate(start_date, end_date)
        .filter(
            ee.Filter.lt(
                "CLOUDY_PIXEL_PERCENTAGE",
                80
            )
        )
    )

    s2_count = s2_collection.size().getInfo()

    print(
        f"{start_date} -> {end_date} | "
        f"S1: {s1_count} images | "
        f"S2: {s2_count} images"
    )

    s2_bands = ["B2", "B3", "B4", "B5", "B6", "B7", "B8", "B8A", "B11", "B12"]
    if s2_count > 0:
        s2 = (
            s2_collection
            .median()
            .clip(roi)
        )
    else:
        print(f"Warning: No Sentinel-2 images found for {start_date}. Using no-data placeholder bands.")
        s2 = ee.Image.cat([
            ee.Image.constant(-9999.0).rename(b) for b in s2_bands
        ]).clip(roi)

    # --------------------------------------
    # DEM
    # --------------------------------------

    dem = (
        ee.Image("NASA/NASADEM_HGT/001")
        .select("elevation")
        .clip(roi)
    )
    terrain = ee.Terrain.products(dem)

    slope = terrain.select("slope")
    # --------------------------------------
    # NDVI
    # --------------------------------------

    if s2_count > 0:
        ndvi = (
            s2.normalizedDifference(
                ["B8", "B4"]
            )
            .rename("NDVI")
        )
    else:
        ndvi = ee.Image.constant(-9999.0).rename("NDVI").clip(roi)

    # --------------------------------------
    # STACK CHANNELS
    # --------------------------------------
    era5 = (
        ee.ImageCollection(
            "ECMWF/ERA5_LAND/MONTHLY_AGGR"
        )
        .filterDate(
            start_date,
            end_date
        )
        .mean()
        .clip(roi)
    )
    temperature = era5.select(
        "temperature_2m"
    )
    precipitation = era5.select(
        "total_precipitation_sum"
    )
    stack = ee.Image.cat([

        s2.select("B2"),
        s2.select("B3"),
        s2.select("B4"),

        s2.select("B5"),
        s2.select("B6"),
        s2.select("B7"),

        s2.select("B8"),
        s2.select("B8A"),

        s2.select("B11"),
        s2.select("B12"),

        s1.select("VV"),
        s1.select("VH"),

        temperature,
        precipitation,

        dem,
        slope,
        ndvi

    ]).double()
    
    band_names = [

        "B2",
        "B3",
        "B4",

        "B5",
        "B6",
        "B7",

        "B8",
        "B8A",

        "B11",
        "B12",

        "VV",
        "VH",

        "temperature_2m",
        "total_precipitation_sum",

        "elevation",
        "slope",
        "NDVI"
    ]

    prepared = stack.clipToBoundsAndScale(
        geometry=roi,
        scale=10
    )

    pixels = ee.data.computePixels({
        "expression": prepared,
        "fileFormat": "NUMPY_NDARRAY",
        "bandIds": band_names
    })

    tensor = np.stack(
        [pixels[b] for b in band_names],
        axis=-1
    )

    # Convert placeholder -9999.0 values to actual np.nan values for temporal interpolation
    tensor[tensor <= -9000.0] = np.nan

    # Preserve NaNs. Only clean up potential infs.
    tensor = np.where(np.isinf(tensor), 0.0, tensor)

    # --------------------------------------
    # FORCE EXACT PATCH SIZE
    # --------------------------------------

    h, w, c = tensor.shape

    start_h = (h - patch_size) // 2
    start_w = (w - patch_size) // 2

    tensor = tensor[
        start_h:start_h + patch_size,
        start_w:start_w + patch_size,
        :
    ]

    return tensor


# ==================================================
# COMPLETE TIME SERIES
# ==================================================

def interpolate_nans_temporal_vectorized(tensor):
    """
    Vectorized interpolation of NaN values in a 4D tensor (T, H, W, C) along the time axis (T).
    Any remaining NaNs (e.g. if the entire sequence for a pixel/channel is NaN)
    are filled with 0.0.
    """
    T, H, W, C = tensor.shape
    # Reshape to (T, H * W * C)
    flat = tensor.reshape(T, -1)
    
    nan_mask = np.isnan(flat)
    nan_cols = np.any(nan_mask, axis=0)
    
    if np.any(nan_cols):
        x = np.arange(T)
        for col_idx in np.where(nan_cols)[0]:
            series = flat[:, col_idx]
            nans = nan_mask[:, col_idx]
            if np.all(nans):
                flat[:, col_idx] = 0.0
            else:
                known_x = x[~nans]
                known_y = series[~nans]
                flat[nans, col_idx] = np.interp(x[nans], known_x, known_y)
                
    tensor = flat.reshape(T, H, W, C)
    return np.nan_to_num(tensor, nan=0.0, posinf=0.0, neginf=0.0)


def generate_timeseries_tensor(
    lat,
    lon,
    start_date,
    end_date,
    patch_size=64,
    spatial_buffer=None
):

    periods = monthly_ranges(
        start_date,
        end_date
    )

    tensors = []
    timestamps = []

    for start, end in periods:

        print(f"\nProcessing {start} -> {end}")

        patch = get_patch_for_period(
            lat=lat,
            lon=lon,
            start_date=start,
            end_date=end,
            patch_size=patch_size
        )

        if patch is None:
            print(f"Warning: Failed to fetch patch for {start}. Using NaN placeholder patch.")
            patch = np.full((patch_size, patch_size, 17), np.nan)

        tensors.append(patch)
        timestamps.append(start)

    if len(tensors) == 0:
        raise ValueError(
            "No valid satellite observations found."
        )

    tensor_sequence = np.stack(
        tensors,
        axis=0
    )

    # Apply temporal interpolation over the sequence to resolve NaN values (monsoon clouds)
    print("\n[Data Engineering] Applying temporal interpolation for cloud-mask gaps...")
    tensor_sequence = interpolate_nans_temporal_vectorized(tensor_sequence)

    # Apply spatial boundary sanitation to isolate the core farm patch
    if spatial_buffer is not None:
        print(f"[Data Engineering] Applying boundary sanitation crop (buffer: {spatial_buffer})...")
        T, H, W, C = tensor_sequence.shape
        half_h, half_w = H // 2, W // 2
        sh, eh = half_h - spatial_buffer, half_h + spatial_buffer
        sw, ew = half_w - spatial_buffer, half_w + spatial_buffer
        tensor_sequence = tensor_sequence[:, sh:eh, sw:ew, :]
        print(f"New tensor shape after crop: {tensor_sequence.shape}")

    return {
        "tensor": tensor_sequence,
        "timestamps": timestamps,
        "channels": [
            "B2",
            "B3",
            "B4",
            "B5",
            "B6",
            "B7",
            "B8",
            "B8A",
            "B11",
            "B12",
            "VV",
            "VH",
            "temperature_2m",
            "total_precipitation_sum",
            "elevation",
            "slope",
            "NDVI"
        ]
    }


# ==================================================
# TEST
# ==================================================

if __name__ == "__main__":
    # Calibrate to Andhra Pradesh Paddy Pilot coordinates and Kharif/Rabi seasons
    # Using spatial_buffer=16 to produce 32x32 clean farm patches
    print("--- Extracting Kharif Season (June - Nov 2024) ---")
    kharif_result = generate_timeseries_tensor(
        lat=16.5062,
        lon=80.6480,
        start_date="2024-06-01",
        end_date="2024-11-30",
        patch_size=64,
        spatial_buffer=16
    )
    np.save("DataEngineering/farm_timeseries_kharif.npy", kharif_result["tensor"])
    np.save("DataEngineering/farm_timeseries.npy", kharif_result["tensor"]) # standard fallback
    
    print("\n--- Extracting Rabi Season (Dec 2024 - May 2025) ---")
    rabi_result = generate_timeseries_tensor(
        lat=16.5062,
        lon=80.6480,
        start_date="2024-12-01",
        end_date="2025-05-31",
        patch_size=64,
        spatial_buffer=16
    )
    np.save("DataEngineering/farm_timeseries_rabi.npy", rabi_result["tensor"])
    
    print("\n=================================")
    print("PILOT EXTRACTION COMPLETE")
    print("=================================")
    print("Kharif Shape:", kharif_result["tensor"].shape)
    print("Rabi Shape:  ", rabi_result["tensor"].shape)
    print("\nTensors saved to 'DataEngineering/farm_timeseries_kharif.npy' and 'rabi.npy'")