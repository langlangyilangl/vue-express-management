const db = require('../../model/db')


//模糊查询某个或者某些指定(通过名字)
exports.getSomeCustomerInfo = (req, res) => {
  //根据这个customerName查有符合条件的页码和一页多少
  const { customerName, page, size } = req.body

  const beforeSize = (page - 1) * size //前面多少条
  const sql = `SELECT * FROM (select * from customer where customerName like ?) as A  ORDER BY customerId LIMIT ?,?;`
  db.query(sql, [`%${customerName}%`, beforeSize, size], (err, result) => {
    if (err) {
      return res.cc(err)
    }

    if (result.length == 0) {
      return res.cc('超出查询限制', 410)
    }

    return res.cc('查询成功', 200, result)
  })
}

//查询所有顾客信息
exports.getAllCustomerInfo = (req, res) => {
  const { page, size } = req.body
  const beforeSize = (page - 1) * size //前面多少条
  const sql = 'select * from customer ORDER BY customerId LIMIT ?,?;'
  db.query(sql, [beforeSize, size], (err, result) => {
    if (err) {
      return res.cc(err)
    }

    if (result.length == 0) {
      return res.cc('超出查询限制', 410)
    }

    return res.cc('查询成功', 200, result)
  })
}

//添加一个新顾客
exports.addOneCustomer = (req, res) => {
  //新创建的用户没有保证金，默认为0元
  const { bankNumber, bankName } = req.body

  //先判断银行卡和银行名是否都存在或者都不存在
  if ((bankNumber && bankName) || (!bankNumber && !bankName)) {
    const sql = `insert into customer set ?`
    db.query(sql, req.body, (err, result) => {
      if (err) {
        return res.cc(err)
      }

      if (result.affectedRows === 0) {
        return res.cc('添加顾客失败', 500)
      }
      if (result.affectedRows !== 1) {
        return res.cc('可能添加了多个顾客，或者未知错误', 500)
      }

      //判断银行名称和卡号是否都存在
      if (bankNumber && bankName) {
        //需要将银行卡信息存到银行卡表 card中
        const { insertId } = result
        console.log('insertId', insertId);
        const cardInfo = { bankNumber, bankName, customerId: insertId }
        const sql2 = 'insert into card set ?'
        db.query(sql2, cardInfo, (err, result2) => {
          if (err) {
            return res.cc(err)
          }

          if (result2.affectedRows === 0) {
            return res.cc('添加银行卡信息失败', 500)
          }
          if (result2.affectedRows !== 1) {
            return res.cc('可能添加了多个银行卡信息，或者未知错误', 500)
          }

          return res.cc('成功添加顾客及其银行卡信息', 200)
        })
      } else {
        return res.cc('成功添加顾客信息', 200)
      }
    })
  } else {
    res.cc('银行卡和银行名不是都存在或者都不存在')
  }
}

// 修改顾客信息
exports.updateCustomer = (req, res) => {
  const { customerId, customerName } = req.body
  // 取出customerId来唯一判断顾客
  //判断是否有id
  if (customerId) {
    const sql = 'update customer set ? where customerId = ?'
    db.query(sql, [req.body, customerId], (err, result) => {
      if (err) {
        return res.cc(err)
      }
      if (result.affectedRows === 0) {
        return res.cc('该用户不存在，修改失败', 500)
      }
      if (result.affectedRows !== 1) {
        return res.cc('可能修改了多个用户，或者未知错误', 500)
      }

      return res.cc(`${customerName}用户信息成功`, 200)
    })
  } else {
    return res.cc('未输入用户id')
  }
}
