
export const svdImageCompressionCode = `
import numpy as np
import matplotlib.pyplot as plt
import base64
from io import BytesIO

# 1. Generate a sample image using numpy
# This removes the need for an external network request.
np.random.seed(0)
image_gray = np.zeros((128, 128))
# Create some shapes
image_gray[20:40, 20:40] = 1 # Square
image_gray[50:80, 50:80] = np.tile(np.linspace(0, 1, 30), (30, 1)) # Gradient
# Add some noise
image_gray += np.random.rand(128, 128) * 0.2

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

# Create an HTML img tag to display the plot
img_html = f'<img src="data:image/png;base64,{img_str}" alt="SVD Image Compression" />'

# Get the output element
output_element = pyscript.dom.get_element_by_id("output-svd-solver")
output_element.innerHTML = img_html
`
