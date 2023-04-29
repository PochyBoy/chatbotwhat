import { Router } from "express";
import { receiveMessage, verifyToken } from "../controller/whatsapp.controller";


const router = Router()

router.get('/token', verifyToken)
router.post('/recibir', receiveMessage)

export default router