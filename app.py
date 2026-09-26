import os
from flask import Flask, jsonify, render_template
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Dynamic student performance dataset
STUDENTS_METRICS = [
    {"id": 1, "name": "Alice Johnson", "major": "Computer Science", "gpa": 3.8, "attendance": 95},
    {"id": 2, "name": "Bob Smith", "major": "Data Science", "gpa": 3.2, "attendance": 88},
    {"id": 3, "name": "Charlie Davis", "major": "Software Engineering", "gpa": 3.9, "attendance": 92},
    {"id": 4, "name": "Diana Prince", "major": "Cybersecurity", "gpa": 3.6, "attendance": 90},
    {"id": 5, "name": "Evan Wright", "major": "AI & Robotics", "gpa": 3.4, "attendance": 85},
]

@app.route("/", methods=["GET"])
def home():
    """Serves the dashboard UI."""
    return render_template("index.html")

@app.route("/api/analytics", methods=["GET"])
def get_analytics():
    """Returns dynamic data consumed by Chart.js."""
    labels = [s["name"] for s in STUDENTS_METRICS]
    gpas = [s["gpa"] for s in STUDENTS_METRICS]
    attendance = [s["attendance"] for s in STUDENTS_METRICS]

    return jsonify({
        "status": "success",
        "labels": labels,
        "gpas": gpas,
        "attendance": attendance,
        "students": STUDENTS_METRICS
    }), 200

if __name__ == "__main__":
    # Render and Heroku bind automatically to the PORT environment variable
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)