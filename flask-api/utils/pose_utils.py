import json
import numpy as np
import mediapipe as mp
import cv2
from io import BytesIO
from PIL import Image

mp_pose = mp.solutions.pose

def process_pose_image(image_file):
    image = Image.open(image_file).convert("RGB")
    image_np = np.array(image)

    with mp_pose.Pose(static_image_mode=True) as pose:
        results = pose.process(image_np)
        if not results.pose_landmarks:
            print("[INFO] No pose landmarks detected.")
            return None

        # Draw and save pose landmarks for debugging
        mp_drawing = mp.solutions.drawing_utils
        annotated_image = image_np.copy()
        mp_drawing.draw_landmarks(
            annotated_image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS
        )
        cv2.imwrite("pose_debug.jpg", cv2.cvtColor(annotated_image, cv2.COLOR_RGB2BGR))

        landmarks = []
        for lm in results.pose_landmarks.landmark:
            landmarks.append([lm.x, lm.y, lm.z, lm.visibility])
        return np.array(landmarks)


def compare_with_ideal(user_landmarks, pose_name):
    try:
        with open(f'ideal_poses/{pose_name}.json', 'r') as f:
            ideal = np.array(json.load(f))
    except FileNotFoundError:
        return 0, 'Ideal pose not found.'

    user_norm = normalize_landmarks(user_landmarks)
    ideal_norm = normalize_landmarks(ideal)

    diffs = np.linalg.norm(user_norm - ideal_norm, axis=1)
    mean_diff = np.mean(diffs)

    accuracy = max(0, 100 - mean_diff * 1000)

    worst_joint_index = np.argmax(diffs)
    feedback = f'Largest deviation at joint #{worst_joint_index}'

    return round(accuracy, 2), feedback

def normalize_landmarks(landmarks):
    left_hip = landmarks[23][:3]
    right_hip = landmarks[24][:3]
    center = (np.array(left_hip) + np.array(right_hip)) / 2

    landmarks_centered = landmarks[:, :3] - center
    scale = np.linalg.norm(landmarks_centered[11] - landmarks_centered[12]) 
    landmarks_normalized = landmarks_centered / (scale + 1e-6)

    return landmarks_normalized
