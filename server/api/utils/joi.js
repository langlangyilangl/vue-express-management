// 引入joi类型
const joi = require('joi');
/* 
*email()可以定义邮箱类型
*joi.ref('oldpwd')表示和oldpwd值一致
*joi.not(joi.ref('oldpwd'))表示不一致
*concat(password)表示合并joi规则
*joi.not(joi.ref('oldpwd')).concat(password)合并joi规格表示新密码和旧密码相同且符合password规则
*/
// const name = joi.string().min(2).max(10)

//用户属性限制
const username = joi.string().alphanum().min(2).max(30).required().error(new Error('用户名格式错误'));
const password = joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))

// 顾客属性限制
const customerId = joi.number();
const customerName = joi.string().min(2).max(30).required();
const customerType = joi.string().required().valid('person', 'factory', 'supplier').error(new Error('只能输入个人，供应商和工厂'))
const registerDate = joi.date().required()
const tel = joi.string().required().pattern(new RegExp('^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\\d{8}$'), 'numbers')
const cardId = joi.string().alphanum().required()
  .pattern(new RegExp('^[1-9]\\d{5}(18|19|([23]\\d))\\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]$')).error(new Error('身份证格式错误'))
const bankNumber = joi.string().creditCard().allow('').allow(null)
const bankName = joi.string().allow('').allow(null)
const otherTel = joi.string().pattern(new RegExp('^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\\d{8}$'), 'numbers').allow('').allow(null)
const principalName = joi.string().min(2).max(10).allow('').allow(null)
const handName = joi.string().min(2).max(10).required()
const handCompany = joi.string().min(2).max(10).required()
const promisePrice = joi.number().allow('').allow(null)

exports.getUserSchema = {
  body: {
    username,
    password
  }
};

exports.getCustomerSchema = {
  body: {
    customerId,
    customerName,
    customerType,
    registerDate,
    tel,
    cardId,
    bankNumber,
    bankName,
    otherTel,
    principalName,
    handName,
    handCompany,
    promisePrice
  }
};