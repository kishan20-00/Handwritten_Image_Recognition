from flask import Flask, request, jsonify, render_template, send_file
import numpy as np
import cv2 as cv
import tensorflow as tf
import joblib
import os
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

# Load the trained model and label encoder
model = tf.keras.models.load_model('recognition_model_2.h5')
encoder = joblib.load('label_encoder_2.pkl')

app = Flask(__name__)

# Define the label map for character predictions
label_map = {
    0: 'A', 1: 'B', 2: 'C', 3: 'D', 4: 'E', 5: 'F', 6: 'G', 7: 'H', 8: 'I', 9: 'J',
    10: 'K', 11: 'L', 12: 'M', 13: 'N', 14: 'O', 15: 'P', 16: 'Q', 17: 'R', 18: 'S', 19: 'T',
    20: 'U', 21: 'V', 22: 'W', 23: 'X', 24: 'Y', 25: 'Z'
}

def segment_words(image):
    gray = cv.cvtColor(image, cv.COLOR_BGR2GRAY)
    _, thresh = cv.threshold(gray, 128, 255, cv.THRESH_BINARY_INV)
    contours, _ = cv.findContours(thresh, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)
    word_images = []
    for cnt in contours:
        x, y, w, h = cv.boundingRect(cnt)
        word_images.append(image[y:y+h, x:x+w])
    return word_images


def segment_letters(word_image):
    # Convert to grayscale
    gray = cv.cvtColor(word_image, cv.COLOR_BGR2GRAY)

    # Apply threshold
    _, thresh = cv.threshold(gray, 127, 255, cv.THRESH_BINARY_INV)

    # Find contours
    contours, _ = cv.findContours(thresh, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)

    letter_images = []
    for cnt in contours:
        x, y, w, h = cv.boundingRect(cnt)
        letter_images.append(thresh[y:y+h, x:x+w])  # Use thresholded image (single channel)

    return sorted(letter_images, key=lambda x: cv.boundingRect(x)[0])



def predict_character(image):
    if len(image.shape) == 3:
        image = cv.cvtColor(image, cv.COLOR_BGR2GRAY)

    image = cv.resize(image, (28, 28))
    image = image.astype('float32') / 255.0
    image = np.expand_dims(image, axis=-1)  # Add channel dimension
    image = image.reshape(1, 28*28)  # Flatten the image to match model input

    prediction = model.predict(image)
    predicted_class = np.argmax(prediction)
    return label_map[predicted_class]



def generate_pdf(text, output_path='output.pdf'):
    c = canvas.Canvas(output_path, pagesize=letter)
    width, height = letter
    c.drawString(100, height - 100, text)
    c.save()
    return output_path

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'image' not in request.files:
        return 'No file part'
    file = request.files['image']
    if file.filename == '':
        return 'No selected file'

    image = cv.imdecode(np.frombuffer(file.read(), np.uint8), cv.IMREAD_COLOR)
    word_images = segment_words(image)

    recognized_text = []
    for word_image in word_images:
        letter_images = segment_letters(word_image)
        word = ''.join([predict_character(letter) for letter in letter_images])
        recognized_text.append(word)

    final_text = ' '.join(recognized_text)
    pdf_path = generate_pdf(final_text)

    return send_file(pdf_path, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)
