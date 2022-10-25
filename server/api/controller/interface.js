const { Router } = require('express')
const myrouter = require('./router')
const expressJoi = require('@escook/express-joi');// 导入验证中间件express-joi
const getUsersSchema = require('../utils/joi')

const router = Router()

//用户登录
router.post('/user/login', expressJoi(getUsersSchema), myrouter.login)

//用户注册
router.post('/user/reguser', expressJoi(getUsersSchema), myrouter.reguser)

//获取用户信息
router.post('/user/info',myrouter.info)

module.exports = router