const { query } = require('express')
const db = require('../../model/db')
const jsonwebtoken = require('jsonwebtoken')
const bcrypt = require('bcrypt')    //加密插件
const { expressjwt: jwt } = require('express-jwt')


const saltRounds = 8 //加密key
const keyPravity = 'yulang'    //加密key

//注册用户
exports.reguser = (req, res) => {
  //获取用户信息
  const user = req.body

  const sql1 = 'select * from user where username = ?'
  db.query(sql1, user.username, (err, result) => {
    if (err) {
      return res.send({ msg: err })
    }

    //判断搜素该用户名是否已经存在
    if (result.length > 0) {
      return res.cc('该用户名已被占用', 401)
    }

    //不存在则向其插入信息
    const sql2 = 'insert into user set ?'

    const password = bcrypt.hashSync(user.password, saltRounds); //加密密码，在数据库存储加密密码

    db.query(sql2, { username: user.username, password }, (err, result) => {
      if (err) {
        console.log('ss');
        return res.send({ msg: err })
      }

      console.log(result.affectedRows);

      if (result.affectedRows !== 1) {   //判读影响行数是否为1
        return res.send({ status: 401, mag: '注册失败,改变行数不为1' })
      }

      return res.send({ mag: '注册成功' })

    })

  })
}

//用户登录
exports.login = (req, res) => {
  const user = req.body

  const sql = 'select * from user where username = ?'

  db.query(sql, user.username, (err, results) => {
    if (err) {
      return res.cc(err)
    }

    if (results.length !== 1) {      //判断查询到的数据是否为1条
      return res.cc('登录失败,查询用户名行数不为1')
    }

    // 比较数据库密码和登录密码是否一致
    if (bcrypt.compareSync(user.password, results[0].password)) {   //result是一个数组，需要拿[0]的字段！！！！！！！！！
      const username = user.username
      const token = jsonwebtoken.sign({ username }, keyPravity, { expiresIn: '1h' })
      return res.cc({ mag: '密码正确，登录成功', token: "Bearer " + token }, 200, { code: 20000, data: "Bearer " + token })
    } else {
      return res.cc('登录失败,密码错误', 401)
    }
  })
}

//获取用户信息
exports.info = (req, res) => {
  const { token } = req.body
  console.log(req.body);
  // jwt(token, 'yulang', (err, data) => {
  //   if (err) return res.cc('获取信息出错')
  //   return res.cc({ msg: '获取正确用户信息', token: data }, 200, { code: 20000, data })
  // })
  const data = jsonwebtoken.verify(token, 'yulang')
  return res.cc({ msg: '获取正确用户信息', token: data }, 200, { code: 20000, data })
}
