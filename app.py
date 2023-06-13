from flask import Flask, render_template, url_for, request, jsonify
from model_prediction import * 
from predict_response import *
app = Flask(__name__)
predicted_emotion=""
predicted_emotion_img_url=""
@app.route('/')
def index():
    entries = show_entry()
    return render_template("index.html", entries=entries)
@app.route('/predict-emotion', methods=["POST"])
def predict_emotion():
    input_text = request.json.get("text")
    if not input_text:
        response = {
                    "status": "error",
                    "message": "Please enter some text to predict emotion!"
                  }
        return jsonify(response)
    else:  
        predicted_emotion, predicted_emotion_img_url = predict(input_text)
        response = {
                    "status": "success",
                    "data": {
                            "predicted_emotion": predicted_emotion,
                            "predicted_emotion_img_url": predicted_emotion_img_url
                            }
                   }
        return jsonify(response)
@app.route("/save-entry", methods=["POST"])
def save_entry():
    date = request.json.get("date")           
    emotion = request.json.get("emotion")
    save_text = request.json.get("text")
    save_text = save_text.replace("\n", " ")
    entry = f'"{date}","{save_text}","{emotion}"\n'
    with open("./static/assets/data_files/data_entry.csv", "a") as f:
        f.write(entry)
    return jsonify("Success")
@app.route("/bot-response",methods=["POST"])
def bot():
    input_text=request.json.get("user_input")
    chat_response=bot_response(input_text)
    response={
        "bot_response":chat_response
    }
    return jsonify(response)
if __name__ == '__main__':
    app.run(debug=True)