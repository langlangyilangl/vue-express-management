// 引入joi类型
const joi = require('joi');

//email()可以定义邮箱类型
const username = joi.string().alphanum().min(3).max(10).required().error(new Error('用户名格式错误'));
const password = joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))

// joi.ref('oldpwd')表示和oldpwd值一致
//joi.not(joi.ref('oldpwd'))表示不一致
//concat(password)表示合并joi规则
//joi.not(joi.ref('oldpwd')).concat(password)合并joi规格表示新密码和旧密码相同且符合password规则

exports.getUsersSchema = {
  body: {
    username,
    password
  }
};