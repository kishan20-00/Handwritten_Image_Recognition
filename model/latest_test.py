import requests

url = 'http://127.0.0.1:5000/segment_and_recognize'
image_path = 's1.jpeg'  # Replace with your image file path

with open(image_path, 'rb') as img:
    files = {'image': img}
    response = requests.post(url, files=files)

if response.status_code == 200:
    print('Response:', response.json())
else:
    print('Failed to get a response:', response.status_code, response.text)
