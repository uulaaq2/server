const express = require('express')
const router = express.Router()
const cors = require('cors')
const headers = require('../options/corsOptions')
const User = require('../classes/User')
const { setSucces, setWarning, setCustom, setError } = require('../functions/setReply')
module.exports = router


router.get('/', cors(), headers, function(req, res) {
  res.send('sign in page get');
})

router.post('/', cors(), headers, function(req, res) {
  const signIn = async () => {
    try {
      if (!req.body.email || !req.body.password) {
        return setWarning('Missing paramters')
      }
  
      const user = new User()
      const userSigninResult = await user.signin(req.body.email, req.body.password)
      
      res.send(await userSigninResult)
    } catch (error) {
      res.send(setError(error))
    }
  }

  signIn()
})

