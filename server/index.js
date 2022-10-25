const express = require('express')
const bodyParser = require('body-parser')
const router = require('./api')
const { host, port } = require('./conf')
const { expressjwt: jwt } = require('express-jwt')


const privateKey = 'yulang'


const app = express()

app.set('host', host)
app.set('port', port)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(jwt({
  secret: privateKey,
  algorithms: ["HS256"],
}).unless({ path: [/^\/vue-admin-template\//] }))


/*
*status 状态码
*msg 响应消息 
*/
app.use((req, res, next) => {
  res.cc = (err, status = 500, other) => {
    res.send({
      status,
      msg: err instanceof Error ? err.message : err,
      ...other
    })
  }
  next()
})

app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://" + app.get('host') + ':' + app.get('port'));
  res.header('Access-Control-Allow-Credentials', true);
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});


app.use((req, res, next) => {
  console.log('进来了');
  // console.log(req.url);
  next()
})

app.use('/vue-admin-template', router)

// app.post('/vue-admin-template/user/login', (req, res) => {
//   console.log('收到用户名');
// })


app.listen(app.get('port'), () => {
  console.log("server running at http://" + app.get('host') + ':' + app.get('port'));
})

