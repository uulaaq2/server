const express = require('express')
const router = express.Router()
const cors = require('cors')
const headers = require('../options/corsOptions')
const { setWarning, setSuccess } = require('../functions/setReply')
const Token = require('../classes/Token')
const Password = require('../classes/Password')
const res = require('express/lib/response')
const User = require('../classes/User')


router.get('/', cors(), headers, function(req, res) {
  res.send('user page get');
})

router.post('/', cors(), headers, function(req, res) {
  res.send('user page post');
})

router.post('/me/verifypassword', cors(), headers, function(req, res) {
  if (!req.body.password || !req.body.token) {
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

    const encryptedPassword = verifiedTokenResult.decryptedData.password
    const password = new Password()  
    const verifyPasswordResult = password.decryptPassword(req.body.password, encryptedPassword)
  
    res.send(verifyPasswordResult)
  }

  main()
})

router.post('/me/changepassword', cors(), headers, function(req, res) {
  if (!req.body.newPassword || !req.body.token) {
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

    const emailAddress = verifiedTokenResult.decryptedData.email    
    console.log(verifiedTokenResult)

    const user = new User()
    const userChangePasswordResult = await user.changePassword(emailAddress, req.body.newPassword)
    res.send(userChangePasswordResult)
  }

  main()
})

router.post('/me/emailpasswordresetlink', cors(), headers, function(req, res) {
  if (!req.body.email || !req.body.linkToUrl) {
    res.send(setWarning('Missing parameters'))
    return
  }
  const main = async () => {
    const user = new User()
    const emailResetPasswordLinkResult = await user.emailResetPasswordLink(req.body.email, req.body.linkToUrl)   

    res.send(emailResetPasswordLinkResult)
  }

  main()
})


module.exports = router