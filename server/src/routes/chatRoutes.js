import express from 'express'
import { createChat,getMyChats,getChatById, joinChat, getChatMessages } from '../controllers/chatController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = express.Router()

// get -> получение всех пользователей
router.post('/create', authMiddleware,createChat)
router.get('/getChats',authMiddleware,getMyChats)
router.get('/getChat', authMiddleware, getChatById)
router.post('/joinChat',authMiddleware, joinChat)
router.get('/getMessages', authMiddleware,getChatMessages)

export default router
