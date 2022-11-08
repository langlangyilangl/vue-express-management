const { Router } = require('express')
const expressJoi = require('@escook/express-joi');// 导入验证中间件express-joi
const { getCustomerSchema } = require('../utils/joi')
const { getAllCustomerInfo, getSomeCustomerInfo, addOneCustomer } = require('../controller/customer')

const router = Router()

//获取全部顾客信息
router.post('/customer/getAllCustomerInfo', getAllCustomerInfo)

// 模糊查询获取用户信息
router.post('/customer/getSomeCustomerInfo', getSomeCustomerInfo)

//所有添加需要用joi对类型进行限制
router.post('/customer/addOneCustomer', expressJoi(getCustomerSchema), addOneCustomer)

module.exports = router

