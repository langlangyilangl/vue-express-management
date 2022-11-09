const { Router } = require('express')
const userRouter = require('./router/userRouter')
const customerRouter = require('./router/customerRouter')

const router = Router()

router.use('/user',userRouter)
router.use('/customer',customerRouter)

module.exports =  router