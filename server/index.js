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


/*
*status 状态码
*msg 响应消息 
*/
app.use((req, res, next) => {
  res.cc = (msg, code = 500, data) => {
    res.send({
      code,
      message: msg instanceof Error ? msg.message : msg,
      data
    })
  }
  next()
})

app.use(jwt({
  secret: privateKey,
  algorithms: ["HS256"],
}).unless({ path: [/^\/user\//] }))


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

app.use(router)

app.post('/test', (req, res, next) => {
  res.cc('通过', 200, { mag: '你好' })
})

//错误中间件
app.use((err, req, res, next) => {
  if (err.message === 'jwt expired')
    return res.cc('token出错了或者过期了！！', 409)
  if (err.message === 'jwt malformed')
    return res.cc('token格式错误', 409)
  return res.cc(err, 500, { mag: '先拦一下,错误中间件拦截' })
})


app.listen(app.get('port'), () => {
  console.log("server running at http://" + app.get('host') + ':' + app.get('port'));
})

