import express from 'express'
import userController from '../controller/user-controller.js'
import noteController from '../controller/note-controller.js'
import tagController from '../controller/tag-controller.js'
import noteTagController from '../controller/note-tag-controller.js'
import { authMiddleware } from '../middleware/auth-middleware.js'

const userRouter = new express.Router()
userRouter.use(authMiddleware)

userRouter.get('/api/users/current', userController.get)
userRouter.patch('/api/users/current', userController.update)
userRouter.delete('/api/users/logout', userController.logout)

userRouter.post('/api/notes', noteController.create)
userRouter.get('/api/notes/:noteId', noteController.get)
userRouter.put('/api/notes/:noteId', noteController.update)
userRouter.delete('/api/notes/:noteId', noteController.remove)
userRouter.get('/api/notes', noteController.search)
userRouter.post('/api/notes/filter', noteController.filterByTag)

userRouter.get('/api/notes/:noteId/tags', noteTagController.getTag)
userRouter.post('/api/notes/:noteId/tags', noteTagController.addTag)
userRouter.put('/api/notes/:noteId/tags', noteTagController.updateTag)

userRouter.post('/api/tags', tagController.create)
userRouter.get('/api/tags/:username', tagController.get)
userRouter.put('/api/tags/:tagId', tagController.update)
userRouter.delete('/api/tags/:tagId', tagController.remove)

export { userRouter }
