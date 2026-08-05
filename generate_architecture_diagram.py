import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.lines import Line2D

def create_architecture_diagram():
    fig, ax = plt.subplots(figsize=(16, 9), dpi=300)
    ax.set_xlim(0, 16)
    ax.set_ylim(0, 9)
    ax.axis('off')
    
    # Colors
    c_blue_light = "#E8F4F8"
    c_blue_mid = "#D0E7F0"
    c_blue_dark = "#1B4F72"
    c_teal_light = "#E0F2F1"
    c_teal_mid = "#B2DFDB"
    c_green_light = "#E8F5E9"
    c_gray = "#F2F4F4"
    c_border = "#2C3E50"
    
    def add_box(x, y, w, h, title, subtitle="", bg=c_blue_light, border=c_border, fontsize=10):
        rect = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.15", 
                                      facecolor=bg, edgecolor=border, linewidth=1.5)
        ax.add_patch(rect)
        if subtitle:
            ax.text(x + w/2, y + h*0.62, title, ha='center', va='center', 
                    fontsize=fontsize, fontweight='bold', color='#1A252C')
            ax.text(x + w/2, y + h*0.30, subtitle, ha='center', va='center', 
                    fontsize=fontsize-2, color='#34495E', linespacing=1.2)
        else:
            ax.text(x + w/2, y + h/2, title, ha='center', va='center', 
                    fontsize=fontsize, fontweight='bold', color='#1A252C')
        return x + w, y + h/2

    def add_arrow(x1, y1, x2, y2):
        ax.annotate('', xy=(x2, y2), xytext=(x1, y1),
                    arrowprops=dict(arrowstyle="->", color=c_border, lw=2.0, shrinkA=2, shrinkB=2))

    # ---- Section Headers ----
    headers = [
        (1.5, 8.4, "1. Data Ingestion"),
        (5.5, 8.4, "2. Feature Extraction"),
        (10.0, 8.4, "3. Parallel Validation Modules"),
        (14.2, 8.4, "4. Output Decision")
    ]
    for x, y, text in headers:
        ax.text(x, y, text, ha='center', va='center', fontsize=13, fontweight='bold', color=c_blue_dark)
        
    # ---- Stage 1: Data Ingestion ----
    add_box(0.5, 6.8, 2.2, 0.9, "Sentinel-2 Optical", "64x64 pixel L2A", bg=c_teal_light)
    add_box(0.5, 5.5, 2.2, 0.9, "Sentinel-1 SAR", "64x64 pixel VV/VH", bg=c_teal_light)
    add_box(0.5, 4.2, 2.2, 0.9, "ERA5 Weather", "64x64 pixel Temp/Precip", bg=c_teal_light)
    add_box(0.5, 2.9, 2.2, 0.9, "Topography", "64x64 pixel NASADEM", bg=c_teal_light)
    
    # Crop operator & 32x32 Core
    add_box(3.2, 4.8, 1.2, 1.0, "Crop\nOperator", "2w x 2w core", bg="#FCE4EC")
    add_box(4.8, 4.4, 1.8, 1.8, "32x32 Pixel\nFarm Patch", "Cropped time series\nto field core\n(resolves boundary\nmixing)", bg=c_green_light, fontsize=10)
    
    # Connect inputs to crop oper
    for y_val in [7.25, 5.95, 4.65, 3.35]:
        add_arrow(2.7, y_val, 3.2, 5.3)
    add_arrow(4.4, 5.3, 4.8, 5.3)
    
    # ---- Stage 2: Feature Extraction ----
    add_box(7.2, 4.3, 1.8, 2.0, "Presto\nFoundation Model", "128-D Temporal\nEmbedding Vector\n(Invariant Encoder)", bg="#E8EAF6", fontsize=11)
    add_arrow(6.6, 5.3, 7.2, 5.3)
    
    # ---- Stage 3: Parallel Validation Modules ----
    # Agronomic Validation Box (Top)
    rect_agro = patches.FancyBboxPatch((9.5, 4.9), 3.4, 2.9, boxstyle="round,pad=0.2", 
                                       facecolor=c_blue_light, edgecolor=c_blue_dark, linewidth=1.5)
    ax.add_patch(rect_agro)
    ax.text(11.2, 7.45, "Agronomic Validation Layer", ha='center', va='center', fontsize=11, fontweight='bold', color=c_blue_dark)
    add_box(9.8, 6.3, 2.8, 0.9, "Growth Stage Engine", "Pearson correlation template matching", bg=c_teal_mid, fontsize=9)
    add_box(9.8, 5.1, 2.8, 1.0, "Jensen Multiplicative Model", "Calibrated stage-specific water\nstress sensitivity coefficients K_y,i", bg=c_teal_mid, fontsize=9)
    
    # Mamba SSM Box (Bottom)
    rect_mamba = patches.FancyBboxPatch((9.5, 1.4), 3.4, 3.1, boxstyle="round,pad=0.2", 
                                        facecolor="#F3E5F5", edgecolor="#6A1B9A", linewidth=1.5)
    ax.add_patch(rect_mamba)
    ax.text(11.2, 4.15, "Mamba SSM Temporal Classifier", ha='center', va='center', fontsize=11, fontweight='bold', color="#6A1B9A")
    add_box(9.8, 2.8, 2.8, 1.0, "Selective Scan Mechanism", "Dynamic gating parameter Δt\nfiltering cloud noise", bg="#E1BEE7", fontsize=9)
    add_box(9.8, 1.6, 2.8, 1.0, "Latent Memory Update", "h_t = A_t h_{t-1} + B_t U_t\n(State preservation)", bg="#E1BEE7", fontsize=9)
    
    # Arrow from Presto to Parallel modules
    add_arrow(9.0, 5.3, 9.5, 6.35)
    add_arrow(9.0, 5.3, 9.5, 2.95)
    
    # ---- Stage 4: Output Decision ----
    add_box(13.3, 4.4, 1.2, 1.8, "Claims\nAudit\nEngine", "4-Way\nDecision\nLogic", bg="#FFF9C4", fontsize=10)
    
    add_box(14.8, 5.8, 1.1, 1.1, "Approved\nPayouts", "Valid stressed\ncrops", bg="#C8E6C9", fontsize=9)
    add_box(14.8, 3.7, 1.1, 1.1, "Flagged for\nVerification", "Anomalies or\nmisreporting", bg="#FFCDD2", fontsize=9)
    
    add_arrow(12.9, 6.35, 13.3, 5.7)
    add_arrow(12.9, 2.95, 13.3, 4.9)
    
    add_arrow(14.5, 5.7, 14.8, 6.35)
    add_arrow(14.5, 4.9, 14.8, 4.25)

    plt.tight_layout()
    output_png = "fig1_architecture_corrected.png"
    output_pdf = "fig1_architecture_corrected.pdf"
    plt.savefig(output_png, dpi=300, bbox_inches='tight')
    plt.savefig(output_pdf, bbox_inches='tight')
    plt.close()
    print(f"Compiled high-res 300 DPI architecture diagrams: {output_png} and {output_pdf}")

if __name__ == "__main__":
    create_architecture_diagram()
