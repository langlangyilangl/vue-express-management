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
      res.cc('超出查询限制', 410)
    }

    res.cc('查询成功', 200, result)
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
      res.cc('超出查询限制', 410)
    }

    res.cc('查询成功', 200, result)
  })
}

//添加一个新顾客
exports.addOneCustomer = (req, res) => {
  const { customerName, customerType, registerDate, tel, cardId, bankNumber, bankName, otherTel,principalName, handName, handCompany
  } = req.body


  const sql = `insert into customer set ?`
  db.query(sql,
    { customerName, customerType, registerDate, tel, cardId, bankNumber, bankName, otherTel,principalName, handName, handCompany },
    (err, result) => {
      if (err) {
        return res.cc(err)
      }

      //判断用户可以相同不需要判断顾客名是否相同
      //需要将银行卡信息存到银行卡表 card中
      
      res.cc('成功',200)
    })
}