import { Router } from 'express'
const router = Router()

// Controllers
import {loginUser} from '../../controllers/users/users'

router.post('/login', loginUser)

export default router
