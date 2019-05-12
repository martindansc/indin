# chat/consumers.py
from channels.generic.websocket import WebsocketConsumer
import json
from . import fuzzy_classifier
import os

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        num = int(json.loads(text_data)["message"])
        time = num/20
        with open('chat/data.json') as json_file:
            li = []

            datas = json.load(json_file)[num]

            for key, data in datas.items():
                percentatge = fuzzy_classifier.execute(data["gender"], data["section"], (time + 1), data["distance"] + 0.1, data["area"])
            
                message = {
                    "id" : key,
                    "gender" : data["gender"],
                    "section" : data["section"],
                    "velocity" : data["distance"]/(time + 1),
                    "distance" : data["gender"],
                    "surface" : data["area"],
                    "positionx" : data["positionx"],
                    "positiony" : data["positiony"],
                    "percentage" : percentatge,
                    "time" : time
                }
                li.append(message)
            
            self.send(json.dumps(li))