from flask import Flask, request, jsonify
import numpy as np
import json
import os

app = Flask(__name__)

IDEAL_POSE_DIR = "ideal_poses"

@app.route('/evaluate-pose', methods=['POST'])
def evaluate_pose():
    data = request.get_json()
    if not data or 'landmarks' not in data or 'pose_name' not in data:
        return jsonify({'error': 'Missing landmarks or pose_name'}), 400

    user_landmarks = np.array(data['landmarks'])
    pose_name = data['pose_name']
    
    ideal_path = os.path.join(IDEAL_POSE_DIR, f"{pose_name}.json")
    if not os.path.exists(ideal_path):
        return jsonify({'error': 'Ideal pose not found'}), 404

    with open(ideal_path, 'r') as f:
        ideal_landmarks = np.array(json.load(f))

    user_norm = normalize_landmarks(user_landmarks)
    ideal_norm = normalize_landmarks(ideal_landmarks)

    diffs = np.linalg.norm(user_norm - ideal_norm, axis=1)
    mean_diff = np.mean(diffs)
    accuracy = max(0, 100 - mean_diff * 1000)

    worst_joint = int(np.argmax(diffs))
    feedback = f"Largest deviation at joint #{worst_joint}"

    return jsonify({
        'pose': pose_name,
        'accuracy': round(accuracy, 2),
        'feedback': feedback
    })

def normalize_landmarks(landmarks):
    if landmarks.shape[0] != 17:
        raise ValueError("Expected 17 keypoints (MoveNet format)")

    left_hip = landmarks[11][:2]
    right_hip = landmarks[12][:2]
    center = (left_hip + right_hip) / 2
    landmarks_centered = landmarks[:, :2] - center

    scale = np.linalg.norm(landmarks_centered[5] - landmarks_centered[6])  # shoulders
    normalized = landmarks_centered / (scale + 1e-6)
    
    # Add dummy Z to keep shape consistent
    normalized_3d = np.concatenate([normalized, np.zeros((17, 1))], axis=1)

    return normalized_3d

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

