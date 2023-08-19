import fs from 'fs';

import config from '../config';

const myConsole = new console.Console(fs.createWriteStream('./log.txt'))

export const verifyToken = (req,res) =>{
    try {
        let accessToken = config.whatsapp
        const challenge = req.query['hub.challenge']
        if ( req.query['hub.mode'] == 'subscribe' &&
        req.query['hub.verify_token'] == accessToken) {
            res.status(200).send(challenge)
        }else{
            res.sendStatus(403)
        }
    } catch (error) {
        res.sendStatus(400)
    }
}

export const receiveMessage = (req,res) =>{
    try {
        var entry = (req.body["entry"])[0];
        var changes = (entry["changes"])[0];
        var value = changes["value"];
        var messageObject = value["messages"];

        if(typeof messageObject != "undefined"){
            var messages = messageObject[0];
            var number = messages["from"];

            var text = GetTextUser(messages);
            console.log(text,number)
            
            if(text != ""){
                processMessage.Process(text, number);
            } 

        }        
            
            res.status(200).send('EVENT_RECEIVED')
       
    } catch (error) {
        res.send('EVENT_RECEIVED')
    }
}

function GetTextUser(messages){
    var text = "";
    var typeMessge = messages["type"];
    if(typeMessge == "text"){
        text = (messages["text"])["body"];
    }
    else if(typeMessge == "interactive"){

        var interactiveObject = messages["interactive"];
        var typeInteractive = interactiveObject["type"];
        
        if(typeInteractive == "button_reply"){
            text = (interactiveObject["button_reply"])["title"];
        }
        else if(typeInteractive == "list_reply"){
            text = (interactiveObject["list_reply"])["title"];
        }else{
            myConsole.log("sin mensaje");
        }
    }else{
        myConsole.log("sin mensaje");
    }
    return text;
}