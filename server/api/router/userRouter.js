const { Router } = require('express')
const { login, reguser, info, logout, getRefreshToken } = require('../controller/user')
const expressJoi = require('@escook/express-joi');// 导入验证中间件express-joi
const { getUserSchema } = require('../utils/joi')

const router = Router()

//用户登录
router.post('/login', expressJoi(getUserSchema), login)

//用户注册
router.post('/reguser', expressJoi(getUserSchema), reguser)

//获取用户信息
router.post('/info', info)

//登出
router.post('/logout', logout)

//通过refreshToken刷新token
router.post('/getRefreshToken', getRefreshToken)



module.exports = router