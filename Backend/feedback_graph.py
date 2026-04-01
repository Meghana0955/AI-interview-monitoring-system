import json
import matplotlib.pyplot as plt

with open("session.json", "r") as f:
    data = json.load(f)

scores = [d["score"] for d in data]

plt.plot(scores)
plt.title("Risk Score Over Time")
plt.xlabel("Time")
plt.ylabel("Risk Score")

plt.show()