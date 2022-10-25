const { Router } = require('express')
const interface = require('./controller/interface')

const router = Router()

router.use(interface)

module.exports =  router