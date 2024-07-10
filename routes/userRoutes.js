import express from "express"
import { getUsers, createUser, updateUser, deleteUser , getUsersById } from '../controllers/UserController.js'

const router = express.Router()

router.get('/user', getUsers)
router.get('/users/:id', getUsersById)
router.post('/users', createUser)
router.put('/users/:id', updateUser)
router.delete('/users/:id', deleteUser)

export default router

