
export const svdImageCompressionCode = `
import numpy as np
import matplotlib.pyplot as plt
from skimage import io
from skimage.color import rgb2gray
import base64
from io import BytesIO

# 1. Load and prepare the image
# Using a URL for a standard test image
url = 'https://upload.wikimedia.org/wikipedia/en/7/7d/Lenna_%28test_image%29.png'
try:
    image_rgb = io.imread(url)
    image_gray = rgb2gray(image_rgb)

    # 2. Perform SVD
    U, S, VT = np.linalg.svd(image_gray, full_matrices=False)

    # 3. Reconstruct the image with a varying number of singular values
    k_values = [5, 15, 50]
    fig, axes = plt.subplots(1, len(k_values) + 1, figsize=(12, 4))
    
    axes[0].imshow(image_gray, cmap='gray')
    axes[0].set_title(f'Original\\nRank ≈ {len(S)}')
    axes[0].axis('off')

    for i, k in enumerate(k_values):
        # Keep only the top k singular values
        reconstructed_matrix = U[:, :k] @ np.diag(S[:k]) @ VT[:k, :]
        
        axes[i+1].imshow(reconstructed_matrix, cmap='gray')
        axes[i+1].set_title(f'k = {k}')
        axes[i+1].axis('off')

    plt.tight_layout()
    
    # Save the plot to a buffer and encode it
    buf = BytesIO()
    plt.savefig(buf, format='png', bbox_inches='tight')
    buf.seek(0)
    img_str = base64.b64encode(buf.getvalue()).decode('utf-8')
    
    # Create an HTML img tag
    img_html = f'<img src="data:image/png;base64,{img_str}" alt="SVD Image Compression" />'
    pyscript.write("output-svd-solver", img_html)

except Exception as e:
    pyscript.write("output-svd-solver", f"Error: Could not load image or perform SVD. Please check the network connection.\\n{e}")

`;
