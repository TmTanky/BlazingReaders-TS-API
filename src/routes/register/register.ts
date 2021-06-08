import { Router } from 'express'
const router = Router()

// Controllers
import {registerUser} from '../../controllers/users/users'

router.post('/register', registerUser)

export default router