const { Router } = require('express')
const userRouter = require('./router/userRouter')
const customerRouter = require('./router/customerRouter')

const router = Router()

router.use(userRouter)
router.use(customerRouter)

module.exports =  router