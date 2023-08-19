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

export const receiveMessage =async (req,res) =>{
    try {
        let data = req.body
        console.log(data.entry[0].changes)
        if (data.object == 'whatsapp_business_account') {
            data.entry.forEach(entry => {
                let webhook_event = entry.messaging[0]
                console.log(webhook_event)
                myConsole.log(webhook_event)
            });
            let response = await client.messages.create({
                messaging_product: 'whatsapp',
                to: number,
                text: { body: '¡Hola! Bienvenido a ITBCP' }
              });
            
            res.status(200).send('EVENT_RECEIVED')
        }else{
            res.sendStatus(405)
        }
    } catch (error) {
        res.send('EVENT_RECEIVED')
    }
}