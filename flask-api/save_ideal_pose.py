import json
import cv2
import numpy as np
import os
import tensorflow as tf
import tensorflow_hub as hub

# Load MoveNet model from TensorFlow Hub
model = hub.load("https://tfhub.dev/google/movenet/singlepose/lightning/4")
movenet = model.signatures['serving_default']

def extract_landmarks(image_path):
    print("extracting 1")
    image = cv2.imread(image_path)
    if image is None:
        print(f"❌ Failed to load image: {image_path}")
        return None
    print("extracting 2")
    input_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    input_image = tf.image.resize_with_pad(tf.convert_to_tensor(input_image), 192, 192)
    input_image = tf.expand_dims(input_image, axis=0)
    input_image = tf.cast(input_image, dtype=tf.int32)
    print("movenet")
    # Run MoveNet
    outputs = movenet(input_image)
    keypoints = outputs['output_0'].numpy()[0][0]  # shape: (17, 3)

    # Convert to [x, y, z (0.0), confidence]
    landmarks = []
    for kp in keypoints:
        y, x, confidence = kp
        landmarks.append([float(x), float(y), 0.0, float(confidence)])

    return landmarks

def save_as_ideal(image_path, pose_name):
    print("started")
    landmarks = extract_landmarks(image_path)
    if landmarks is None:
        print("❌ Could not save ideal pose: No landmarks found.")
        return

    os.makedirs("ideal_poses", exist_ok=True)
    save_path = os.path.join("ideal_poses", f"{pose_name}.json")

    with open(save_path, 'w') as f:
        json.dump(landmarks, f)

    print(f"✅ Saved ideal pose as '{save_path}'")

# Modify and run this line below
if __name__ == "__main__":
    image_path = r"D:\Code\MC app\Expoapp\yogasync\assets\warrior pose.png"
    save_as_ideal(image_path, "warrior_pose")
