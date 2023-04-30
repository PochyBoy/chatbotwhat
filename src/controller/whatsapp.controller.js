import config from "../config"



export const verifyToken = (req,res) =>{
    try {
        let accessToken = 'esteesuntokendewhatperonadaseguro'
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
        
    } catch (error) {
        
    }
}