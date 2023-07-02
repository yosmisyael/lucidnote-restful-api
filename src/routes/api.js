import express from 'express'
import userController from '../controller/user-controller.js'
import noteController from '../controller/note-controller.js'
import { authMiddleware } from '../middleware/auth-middleware.js'

const userRouter = new express.Router()
userRouter.use(authMiddleware)

userRouter.get('/api/users/current', userController.get)
userRouter.patch('/api/users/current', userController.update)
userRouter.delete('/api/users/logout', userController.logout)

userRouter.post('/api/notes', noteController.create)
userRouter.get('/api/notes/:id', noteController.get)
userRouter.put('/api/notes/:id', noteController.update)
userRouter.delete('/api/notes/:id', noteController.remove)

export { userRouter }
