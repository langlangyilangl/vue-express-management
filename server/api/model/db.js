const mysql = require('mysql')
const { host, user, password, database } = require('./conf')

const db = mysql.createPool({
  host,
  user,
  password,
  database
})

module.exports = db