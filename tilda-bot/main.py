#!/usr/bin/python3

import os

from chatterbot import ChatBot
from chatterbot.trainers import ListTrainer

# Create a new chat bot named Charlie
bot = ChatBot(
    'Tilda',
    storage_adapter='chatterbot.storage.SQLStorageAdapter',
    database_uri='sqlite:///tilda.db',
    logic_adapters=[
        'chatterbot.logic.BestMatch'
    ]
)

if (os.environ['TRAIN'] == 'true'):
    # list of conversation in english
    listConvs = [] 
    
    # Seeding listConvs
    for idx in list(range(6)):
        fileHandler = open ("./conversation/" + str(idx+1) + ".txt", "r")
        while True:
            # Get next line from file
            line = fileHandler.readline()

            # If line is empty then end of file reached
            if not line :
                break;
                print(line.strip())
            else:
                listConvs.append(line)
        # Close Close
        fileHandler.close()

    trainer = ListTrainer(bot)
    trainer.train(listConvs)


print('Type something to begin...')
# The following loop will execute each time the user enters input
while True:
    try:
        user_input = input()

        bot_response = bot.get_response(user_input)

        print(bot_response)

    # Press ctrl-c or ctrl-d on the keyboard to exit
    except (KeyboardInterrupt, EOFError, SystemExit):
        break