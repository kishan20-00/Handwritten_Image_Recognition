import requests

# Define the URL of the Flask API
url = 'http://127.0.0.1:5000/upload'  # Update if your server runs on a different host or port

# Path to the image you want to test
image_path = 'handwritten.jpg'

# Open the image file in binary mode
with open(image_path, 'rb') as image_file:
    files = {'image': image_file}
    response = requests.post(url, files=files)

# Check the response
if response.status_code == 200:
    # Save the returned PDF
    with open('output.pdf', 'wb') as f:
        f.write(response.content)
    print("PDF successfully generated and saved as output.pdf")
else:
    print(f"Error: {response.status_code}")
    print(response.text)