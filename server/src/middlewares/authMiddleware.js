import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'

dotenv.config()

const JWT_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET

export const authMiddleware = async (req, res, next) => {
	const token = req.cookies.accessToken

	if (!token) {
		return res.status(401).json({ message: 'Пользователь не авторизован' })
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET)
		console.log(decoded)
		req.user = await User.findById(decoded.id)

		if (!req.user) {
			return res.status(401).json({ message: 'Пользователь не найден' })
		}

		next()
	} catch (error) {
		console.error('Ошибка при валидации токена', error.message)
		return res.status(401).json({ message: 'Неверный токен' })
	}
}
