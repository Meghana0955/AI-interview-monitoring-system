import json

def generate_feedback(file="session.json"):

    with open(file, "r") as f:
        data = json.load(f)

    total = len(data)

    eye_issues = sum(1 for d in data if d["eye"] in ["left","right","down"])
    face_issues = sum(1 for d in data if d["face"] != "Normal")
    voice_issues = sum(1 for d in data if d["voice"] != "Normal")

    avg_score = sum(d["score"] for d in data) / total

    # ---------------- FEEDBACK ---------------- #

    feedback = []

    # Eye
    if eye_issues > total * 0.3:
        feedback.append("Maintain better eye contact with the screen")
    else:
        feedback.append("Good eye contact maintained")

    # Face
    if face_issues > total * 0.2:
        feedback.append("Stay consistently visible in camera")
    else:
        feedback.append("Face visibility is good")

    # Voice
    if voice_issues > total * 0.2:
        feedback.append("Reduce background noise during interview")
    else:
        feedback.append("Audio environment is good")

    # Overall mindset
    if avg_score > 5:
        feedback.append("Avoid distractions and focus on interview honestly")
    else:
        feedback.append("Good focus and discipline observed")

    return {
        "eye_issues": eye_issues,
        "face_issues": face_issues,
        "voice_issues": voice_issues,
        "avg_score": round(avg_score,2),
        "feedback": feedback
    }


if __name__ == "__main__":
    result = generate_feedback()

    print("\n===== INTERVIEW FEEDBACK =====")
    for f in result["feedback"]:
        print("-", f)