from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from google.cloud import vision_v1
from google.cloud import speech_v1p1beta1 as speech
from PIL import Image
import base64
import requests
import os
import io
app = Flask(__name__)
CORS(app)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
CORS(app, resources={r"/*": {"origins": "http://localhost:3001/whiteboard"}})
# Set the environment variable for the service account key file
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "server\\creds\\ocr-vision.json"
@app.route('/ocr', methods=['POST'])
def ocr():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'})

    # Initialize the client
    client = vision_v1.ImageAnnotatorClient()

    # Read the image file
    image = request.files['image'].read()

    # Create an image object
    image_obj = vision_v1.Image(content=image)

    # Perform OCR
    response = client.text_detection(image=image_obj)
    texts = response.text_annotations

    # Extract the detected text
    if texts:
        extracted_text = texts[0].description
    else:
        extracted_text = ""
    return jsonify({'text': extracted_text})
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3001')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
@app.route('/test', methods=['POST'])
def test():
    image_data = request.files['image']
    img = Image.open(image_data)
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='PNG')
    img_bytes.seek(0)

    return send_file(img_bytes, mimetype='image/png')

@app.route('/upload', methods=['POST'])
def upload():
    url = "http://127.0.0.1:5000/test"

    payload = {
        "file": request.files['image']
    }

    response = requests.post(url, files=payload)

    return response.text, response.status_code
@app.route('/caption', methods=['POST'])
def caption():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'})

    audio = request.files['audio']
    content = audio.read()

    client = speech.SpeechClient()
    audio_data = speech.RecognitionAudio(content=content)
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.MP3,
        sample_rate_hertz=16000,
        language_code='en-US',
    )

    response = client.recognize(config=config, audio=audio_data)

    captions = []
    for result in response.results:
        captions.append(result.alternatives[0].transcript)

    return jsonify({'captions': captions})  
if __name__ == '__main__':
    app.run(debug=True)
