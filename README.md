# Indian Crop Geospatial Embedding Pipeline for AI-Driven Crop Insurance

[![Python 3.10+](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.0+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![Google Earth Engine](https://img.shields.io/badge/Google_Earth_Engine-GEE-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://earthengine.google.com)

> An end-to-end geospatial foundation model pipeline leveraging Sentinel-1/2 Earth observation data, Google Earth Engine (GEE), Presto foundation embeddings, and State Space Model (Mamba) temporal sequence architectures for automated, stage-aware crop insurance validation across India.

---

## 📂 Codebase Architecture

```
.
├── paper/                              # Academic paper source, draft & templates
│   ├── IICAIET_Crop_Insurance_Paper.tex  # LaTeX manuscript source
│   ├── IICAIET_Crop_Insurance_Paper.md   # Markdown paper reference draft
│   └── Template_IICAIET_2026_Conference.doc
│
├── reports/                            # Technical reports & generated visualizations
│   ├── validation_report.md            # Comprehensive empirical validation report
│   └── figures/                        # High-resolution benchmark & analysis plots
│       ├── crop_stress_validation_report.png
│       ├── data_verification_report.png
│       ├── indian_regional_separability_report.png
│       ├── indian_season_separability_report.png
│       ├── benchmark_analysis_report.png
│       └── mamba_experiment_results.png
│
├── data/                               # Satellite time-series tensors & Presto embeddings
│   ├── farm_timeseries.npy             # (Timestamps × H × W × 17) multidimensional tensor
│   ├── farm_timeseries_kharif.npy      # Kharif monsoon season time-series tensor
│   ├── farm_timeseries_rabi.npy        # Rabi winter season time-series tensor
│   └── presto_farm_embeddings.npy      # 128-dimensional Presto foundation embeddings
│
├── models/                             # Pre-trained neural model weights & checkpoints
│   └── mamba_paddy_pilot.pt            # Mamba SSM trained classifier weights
│
├── data_engineering/                   # Satellite extraction & embedding pipeline
│   ├── gee_timeseries_pipeline.py      # Google Earth Engine multi-band extractor
│   ├── embedding_api.py                # Presto foundation embedding extractor API
│   ├── presto_encoder.py               # Presto transformer encoder architecture
│   ├── inspect_tensor.py               # Sanity checking & diagnostic visualization
│   ├── regional_analysis.py            # Geographic manifold separability (PCA/t-SNE/UMAP)
│   └── seasonal_analysis.py            # Crop-season separability experiments
│
├── crop_intelligence/                  # Stage-aware phenology & insurance claim validator
│   ├── biological_validation.py        # Biophysical stress indicators (VCI, TCI, VHI)
│   ├── growth_stage_engine.py          # Phenological crop growth stage estimator
│   ├── crop_knowledge_db.py            # Phenology template database for Indian crops
│   ├── insurance_validation.py         # End-to-end claim validation decision engine
│   ├── claim_batch_validation.py       # Batch simulation & benchmark validator (150 claims)
│   └── run_experiments.py              # Crop stress dynamics & fraud detection suite
│
├── temporal_intelligence/              # Mamba SSM sequence modeling & resilience benchmarks
│   ├── mamba_model.py                  # Mamba Selective State Space Model architecture
│   ├── sequence_loader.py              # PyTorch Dataset for spatio-temporal crop tensors
│   ├── baselines.py                    # Benchmark models (LSTM & Transformer)
│   ├── benchmark.py                    # Noise resilience benchmark engine
│   └── run_experiments.py              # Resilience, cloud-contamination & manifold suite
│
├── backend/                            # FastAPI REST API service
│   ├── app.py                          # Claims validation REST API endpoint
│   └── requirements.txt                # Backend dependencies
│
└── frontend/                           # React + Vite interactive web application
    ├── src/                            # Component library & UI dashboard
    ├── public/                         # Static assets & icons
    └── package.json                    # Node.js dependencies
```

---

## ⚡ Quick Start & Environment Setup

### 1. Prerequisites
- Python 3.10 or higher
- Node.js 18+ and npm
- Google Earth Engine (GEE) Account & Project ID

### 2. Python Environment Setup
```bash
# Create and activate a virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install core dependencies
pip install -r backend/requirements.txt
pip install torch torchvision numpy scipy scikit-learn matplotlib seaborn pandas earthengine-api python-dotenv
```

### 3. GEE Authentication
Set up your `.env` file at root with your Earth Engine project ID:
```env
EE_PROJECT_ID=your-google-cloud-project-id
```

---

## 🚀 Execution Guide

### Extract Satellite Tensors & Run Data Analysis
```bash
# Extract Sentinel satellite time-series via GEE
python3 -m data_engineering.gee_timeseries_pipeline

# Inspect tensor integrity
python3 -m data_engineering.inspect_tensor

# Run regional and seasonal embedding separability experiments
python3 -m data_engineering.regional_analysis
python3 -m data_engineering.seasonal_analysis
```

### Run Temporal & Crop Intelligence Benchmarks
```bash
# Run Mamba SSM sequence experiments and noise resilience benchmarks
python3 -m temporal_intelligence.run_experiments

# Run phenology and stage-aware crop stress validation suite
python3 -m crop_intelligence.run_experiments

# Run batch claim validation benchmark (150 claims)
python3 -m crop_intelligence.claim_batch_validation
```

### Launch Backend Server
```bash
# Start FastAPI service on port 8000
python3 -m uvicorn backend.app:app --reload --port 8000
```
Health Check: `http://localhost:8000/health`

### Launch Frontend Dashboard
```bash
cd frontend
npm install
npm run dev
```
Access the dashboard at `http://localhost:5173`.

---

## 📊 Key Results & Reports

- Comprehensive validation findings are documented in [`reports/validation_report.md`](file:///Users/ananyalakshmi/PES/AgriTech/code/reports/validation_report.md).
- Generated visualizations and figures are located in [`reports/figures/`](file:///Users/ananyalakshmi/PES/AgriTech/code/reports/figures/).
- Paper manuscript drafts are located in [`paper/`](file:///Users/ananyalakshmi/PES/AgriTech/code/paper/).
