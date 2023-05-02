import { Router } from "express";
import { receiveMessage, verifyToken } from "../controller/whatsapp.controller";


const router = Router()

router.get('/token', verifyToken)
router.post('/token', receiveMessage)

export default router