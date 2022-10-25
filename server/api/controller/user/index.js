const { query } = require('express')
const db = require('../../model/db')
const jsonwebtoken = require('jsonwebtoken')
const bcrypt = require('bcrypt')    //加密插件
const { expressjwt: jwt } = require('express-jwt')


const saltRounds = 8 //加密key
const keyPravity = 'yulang'    //加密key
const refreshKeyPravity = 'hello world!'

//注册用户
exports.reguser = (req, res) => {
  //获取用户信息
  const user = req.body

  const sql1 = 'select * from user where username = ?'
  db.query(sql1, user.username, (err, result) => {
    if (err) {
      return res.cc(err)
    }

    //判断搜素该用户名是否已经存在
    if (result.length > 0) {
      return res.cc('该用户名已被占用', 40000)
    }

    //不存在则向其插入信息
    const sql2 = 'insert into user set ?'

    const password = bcrypt.hashSync(user.password, saltRounds); //加密密码，在数据库存储加密密码

    db.query(sql2, { username: user.username, password }, (err, result) => {
      if (err) {
        return res.cc(err)
      }

      if (result.affectedRows !== 1) {   //判读影响行数是否为1
        return res.cc('注册失败,改变行数不为1', 40004)
      }

      return res.cc('注册成功', 20000)

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
      return res.cc('登录失败,查询用户名行数不为1', 40004)
    }

    // 比较数据库密码和登录密码是否一致
    if (bcrypt.compareSync(user.password, results[0].password)) {   //result是一个数组，需要拿[0]的字段！！！！！！！！！
      const username = user.username

      const token = jsonwebtoken.sign({ username }, keyPravity, { expiresIn: '30min' })
      const refreshToken = jsonwebtoken.sign({ username }, refreshKeyPravity, { expiresIn: '10h' })

      return res.cc('密码正确，登录成功', 20000, { token: "Bearer " + token, refreshToken })
    } else {
      return res.cc('登录失败,密码错误', 40000)
    }
  })
}

//获取用户信息
exports.info = (req, res) => {
  //获取请求头中携带的token
  const token = req.headers.authorization?.split(" ")[1];


  if (token) {
    jsonwebtoken.verify(token, keyPravity, (err, decoded) => {
      if (err)
        return res.cc('token错误或过期,无法获取用户信息', 40009)


      const sql = 'select * from user where username = ?'
      db.query(sql, decoded.username, (err, results) => {
        if (err) {
          return res.cc(err)
        }

        if (results.length !== 1) {      //判断查询到的数据是否为1条
          return res.cc('获取用户信息失败，用户不存在', 40004)
        }


        //拿到数据库中的该用户的个人信息，处理(避免包括密码不能在网络上传播)后发送
        return res.cc('获取正确用户信息', 20000, results[0])

      })

    })
  } else {
    return res.cc('未获取到token,无法获取用户信息', 40000)
  }
}


//用户注销
exports.logout = (req, res) => {
  res.cc(null, 20000, 'success')
}

//通过refreshToken重新获取token  
exports.getRefreshToken = (req, res) => {
  //获取body中的refreshToken和username
  const { refreshToken } = req.body

  //验证refreshToken是否正确
  jsonwebtoken.verify(refreshToken, refreshKeyPravity, (err, decoded) => {
    if (err) return res.cc('refreshToken错误,请重新登录', 40001)

    //取出refreshToken包含的username
    const { username } = decoded
    const token = jsonwebtoken.sign({ username }, keyPravity, { expiresIn: '30min' })
    const refreshToken = jsonwebtoken.sign({ username }, refreshKeyPravity, { expiresIn: '10h' })

    return res.cc('密码正确，登录成功', 20000, { token: "Bearer " + token, refreshToken })
  })

}
