import { Router } from 'express'
const router = Router()

// Controllers
import {loginUser} from '../../controllers/users/users'

router.get('/login', loginUser)

export default router
