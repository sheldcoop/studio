import numpy as np
from PIL import Image
import requests
from io import BytesIO
import matplotlib.pyplot as plt

def compress_and_display_image(k_values):
    # Fetch image from URL
    # Using a smaller image for faster processing in the browser
    url = "https://picsum.photos/seed/123/256/192"
    response = requests.get(url)
    img = Image.open(BytesIO(response.content)).convert('L') # Convert to grayscale
    
    A = np.array(img)
    
    # Perform SVD
    U, s, Vt = np.linalg.svd(A)
    
    # Create a plot with multiple subplots
    fig, axs = plt.subplots(1, len(k_values), figsize=(15, 5))
    
    for i, k in enumerate(k_values):
        # Reconstruct the image with k singular values
        A_compressed = np.dot(U[:, :k], np.dot(np.diag(s[:k]), Vt[:k, :]))
        
        ax = axs[i]
        ax.imshow(A_compressed, cmap='gray')
        ax.set_title(f"k = {k}")
        ax.axis('off')

    plt.suptitle("SVD Image Compression with Different Ranks (k)")
    plt.tight_layout(rect=[0, 0, 1, 0.96])
    
    # Display the plot in the output element
    display(fig, target="output-svd", append=False)

# Run the compression with different k values
k_values_to_test = [5, 20, 50]
compress_and_display_image(k_values_to_test)

print(f"Original image shape: {np.array(Image.open(BytesIO(requests.get(url).content)).convert('L')).shape}")
print(f"Compressed with k={k_values_to_test}")
