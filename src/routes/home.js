const express = require('express')
const cors = require('cors')
const headers = require('../options/corsOptions')
const SQLQueryBuilder = require('../classes/SQLQueryBuilder')
const db = require('../classes/DB')
const DB = require('../classes/DB')
const Token = require('../classes/Token')
router = express.Router()
module.exports = router

router.get('/', function(req, res) {
  res.send('home')
})

router.post('/getdrawings', cors(), headers, function(req, res) {
  if (!req.body.token) {
    res.send(setWarning('Missing parameters'))
    return
  }

  const main = async () => {
    const token = new Token()
    const verifiedTokenResult = token.verifyToken(req.body.token, true)
    if (verifiedTokenResult.status !== 'ok') {
      res.send(verifiedTokenResult)
  
      return
    }

    const db = new DB()
    const sql = new SQLQueryBuilder()
    const sqlResult = sql.select('*').from('files').orderBy('ID').get()
    
    const result = await db.query(sqlResult.sqlStatement, sqlResult.values)    

    res.send(result)
  }

  main()
})


