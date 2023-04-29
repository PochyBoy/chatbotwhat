import {config} from 'dotenv'
config()

export default {
    puerto: process.env.PORT || 3000,
    whatsapp: process.env.TOKENWHATSAPP,

}