import os,os.path
from flask import Flask
from flask import Response
from flask import json
from flask import request
from chatterbot import ChatBot
from chatterbot.trainers import ChatterBotCorpusTrainer

bot = ChatBot(
    'Tilda',
    storage_adapter='chatterbot.storage.SQLStorageAdapter',
    database_uri='sqlite:///tilda.db',
    logic_adapters=[
        {
            'import_path': 'chatterbot.logic.BestMatch',
            'default_response': 'I am sorry, but I do not understand.',
            'maximum_similarity_threshold': 0.3,
        }
    ],
    filters=[
        'chatterbot.filters.RepetitiveResponseFilter'
    ]
)

app = Flask(__name__)

@app.route('/bot/ping')
def ping():
    return 'ping'

@app.route('/bot/train', methods=['GET'])
def train():
    trainer = ChatterBotCorpusTrainer(bot)
    trainer.train('./conversation/1.yml')
    return 'ok'

@app.route('/bot/talk', methods=['POST'])
def talk():
    user_input = request.get_json()['message']
    bot_response = bot.get_response(user_input)
    print(bot_response)

    reply = {
        "reply": str(bot_response)
    }

    js = json.dumps(reply)
    res = Response(js, status=200, mimetype='application/json')
    
    return res
    # return "" + str(bot_response)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port='5000')