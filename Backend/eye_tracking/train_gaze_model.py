import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib

# Load dataset
data = pd.read_csv("gaze_dataset.csv")

X = data.drop("label", axis=1)
y = data["label"]

# Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train model
model = RandomForestClassifier(n_estimators=100)
model.fit(X_train, y_train)

# Evaluate
preds = model.predict(X_test)
acc = accuracy_score(y_test, preds)
print("Model Accuracy:", acc)

# Save model
joblib.dump(model, "gaze_model.pkl")
print("Model saved as gaze_model.pkl")
