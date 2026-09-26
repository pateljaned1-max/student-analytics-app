import os
import random
from flask import Flask, jsonify, render_template
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

BASE_STUDENTS = [
    {"id": 1, "name": "Alice Johnson", "major": "Computer Science"},
    {"id": 2, "name": "Bob Smith", "major": "Data Science"},
    {"id": 3, "name": "Charlie Davis", "major": "Software Engineering"},
    {"id": 4, "name": "Diana Prince", "major": "Cybersecurity"},
    {"id": 5, "name": "Evan Wright", "major": "AI & Robotics"},
]

@app.route("/", methods=["GET"])
def home():
    return render_template("index.html")

@app.route("/api/analytics", methods=["GET"])
def get_analytics():
    students = []
    labels = []
    gpas = []
    attendance = []

    for s in BASE_STUDENTS:
        current_gpa = round(random.uniform(2.5, 4.0), 2)
        current_att = random.randint(70, 98)
        
        labels.append(s["name"])
        gpas.append(current_gpa)
        attendance.append(current_att)
        
        students.append({
            "id": s["id"],
            "name": s["name"],
            "major": s["major"],
            "gpa": current_gpa,
            "attendance": current_att
        })

    return jsonify({
        "status": "success",
        "labels": labels,
        "gpas": gpas,
        "attendance": attendance,
        "students": students
    }), 200

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)