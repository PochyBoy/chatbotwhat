import app from './app'
import http from 'http'
import config from './config'


const servidor = config.puerto
const server = http.createServer(app)
const httpServer = server.listen(servidor)

console.log("Server on http://localhost:", servidor)