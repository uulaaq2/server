const express = require('express')
router = express.Router()
module.exports = router

router.get('/', function(req, res) {
  res.send('home')
})

