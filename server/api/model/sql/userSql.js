// 通过用户名查询用户字段
exports.getUserInfo = 'select * from user where username = ?'

// 创建新用户
exports.createUser = 'insert into user set ?'