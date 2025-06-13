import Chat from "../models/chatModel.js"
import Message from "../models/messageModel.js"
import User from "../models/userModel.js"
export const createChat = async (req, res, next) => {
	try {
		const { title, privacy, password} = req.body
		const chatExists = await Chat.findOne({title})

		if (chatExists) {
			console.log('test')
			res.status(400)
			throw new Error(
				'Чат с таким названием уже существует'
			)
		}



		const chat = new Chat({
			title,
			privacy,
            members: req.user._id,
			password: privacy == "public" ? null : password,
		})

        const FirstMessage = new Message({
            author: req.user._id,
            chat: chat._id,
            text: `Чат был создан ${(new Date).toString().slice(4,24)}`,
            date: new Date
        })
        chat.messages = FirstMessage._id
		await chat.save()
        await FirstMessage.save()
        await User.updateOne({_id: req.user._id}, {$push: {chats: chat._id}})
		return res.status(201).json({
			_id: chat._id,
			title: chat.title,
		})
	} catch (err) {
		next(err)
	}
}

export const getMyChats = async (req, res, next) => {
	try {
        let MyChatsIds = req.user.chats//.map((el) => Chat.findById(el))
        let MyChats = []
        for(let i = 0;i<MyChatsIds.length;i++){
            MyChats.push(await Chat.findById(MyChatsIds[i])) 
        }
        let LastMessages = []
        console.log(MyChats.messages)
        for(let i = 0;i<MyChats.length;i++){
            LastMessages.push(await Message.findById(MyChats[i].messages[MyChats[i].messages.length-1])) 
        }
		return res.status(201).json({
			chats: MyChats,
			lastMessages: LastMessages,
		})
	} catch (err) {
		next(err)
	}
}

export const getChatById = async (req, res, next) => {
	try {
        const ChatId = req.query.id
        const IdChat = await Chat.findById(ChatId)
        const LastMessage = await Message.findById(IdChat.messages[IdChat.messages.length-1])
        
		return res.status(201).json({
			chat: IdChat,
			lastMessage: LastMessage,
		})
	} catch (err) {
		next(err)
	}
}

export const joinChat = async (req, res, next) => {
	try {
        const {password,ChatId} = req.body
        
        const IdChat = await Chat.findById(ChatId)
        if(IdChat.privacy == 'public'){
            await Chat.updateOne({_id: IdChat._id}, {$push: {members: req.user._id}})
            await User.updateOne({_id: req.user._id}, {$push: {chats: ChatId}})
            return res.status(201).json({
                chats: IdChat,
            })
        }
        else{
            const isMatch = await user.correctPassword(password, user.password)
            if (!isMatch) {
                res.status(400)
                throw new Error('Неверный пароль')
            }
            await Chat.updateOne({_id: ChatId}, {$push: {members: req.user._id}})
            await User.updateOne({_id: req.user._id}, {$push: {chats: ChatId}})
            return res.status(201).json({
                chats: IdChat,
            })
        }
	} catch (err) {
		next(err)
	}
}

export const getChatMessages = async (req, res, next) => {
	try {
        const ChatId = req.query.id
        console.log(ChatId)
        const IdChat = await Chat.findById(ChatId)
        const Messages = []
        for(let i = 0;i<IdChat.messages.length; i++){
            Messages.push(await Message.findById(IdChat.messages[i]))
        }
        console.log(IdChat)
        console.log(Messages)
		return res.status(201).json({
			chat: IdChat,
			messages: Messages,
		})
	} catch (err) {
		next(err)
	}
}
// 5. getChatMessages - получить сообщения чата (email + сообщения: id, text, createdAt)