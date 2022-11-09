const { Router } = require('express')
const expressJoi = require('@escook/express-joi');// 导入验证中间件express-joi
const { getCustomerSchema } = require('../utils/joi')
const { getAllCustomerInfo, getSomeCustomerInfo, addOneCustomer,updateCustomer } = require('../controller/customer')

const router = Router()

//获取全部顾客信息
router.post('/getAllCustomerInfo', getAllCustomerInfo)

// 模糊查询获取顾客信息
router.post('/getSomeCustomerInfo', getSomeCustomerInfo)

//所有添加需要用joi对类型进行限制
router.post('/addOneCustomer', expressJoi(getCustomerSchema), addOneCustomer)

//修改顾客信息
router.post('/updateCustomer',expressJoi(getCustomerSchema),updateCustomer)

module.exports = router

