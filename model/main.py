import os
import numpy as np
from flask import Flask, request, jsonify
from keras.models import load_model
from PIL import Image
from google.cloud import storage

# Inisialisasi aplikasi Flask
app = Flask(__name__)

# Muat model yang sudah dilatih
model_path = 'model.h5'
model = load_model(model_path)

# Fungsi untuk preprocess gambar
def preprocess_image(image, target_size):
    if image.mode != "RGB":
        image = image.convert("RGB")
    image = image.resize(target_size)
    image = np.array(image)
    image = np.expand_dims(image, axis=0)
    return image

# Fungsi untuk memuat gambar mirip dari Google Cloud Storage
def get_similar_paintings(category):
    client = storage.Client()
    bucket = client.get_bucket('your-bucket-name')
    blobs = bucket.list_blobs(prefix=f'{category}/')
    return [blob.public_url for blob in blobs]

# Endpoint untuk prediksi kategori lukisan
@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return "Please upload an image file", 400
    
    file = request.files['file']
    image = Image.open(file.stream)
    processed_image = preprocess_image(image, target_size=(224, 224))

    # Lakukan prediksi
    predictions = model.predict(processed_image)
    category = np.argmax(predictions[0])
    
    # Mendapatkan lukisan mirip
    similar_paintings = get_similar_paintings(category)
    
    return jsonify({
        'category': category,
        'similar_paintings': similar_paintings
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))