import config from "../config"



export const verifyToken = (req,res) =>{
    try {
        let accessToken = config.whatsapp
        const token = req.query['hub.verify_token']
        const challenge = req.query['hub.challenge']
        if (token === accessToken && challenge != null && token != null) {
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
        
    } catch (error) {
        
    }
}