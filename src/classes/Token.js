const jwt = require('jsonwebtoken')
const DateUtils = require('./DateUtils')
const { setSuccess, setWarning, setCustom, setError } = require('../functions/setReply')
const config = require('../config')

class Token {
  // start of generate token function
  generateToken(payload = {}) {
    try {
        const jwtOptions = {
          expiresIn: config.tokenExpiresIn + 'd'
        }    

        const token = jwt.sign(payload, process.env.JWT_SECRET, jwtOptions)

        const data = {
          token
        }

        return setSuccess(data)
    } catch (error) {
        return setError(error)
    }    
  // end of generate token function
  }

  // start of verify token function
  verifyToken(token, ignoreShouldChangePassword = false) {
    try {
      if (!token) {
        throw new Error('No token is provided')
      }
     
      const result = jwt.verify(token, process.env.JWT_SECRET)  
      const accountExpiresAt = result.accountExpiresAt

      const dateUtils = new DateUtils()
      const diffToDate = dateUtils.diffToDate(accountExpiresAt)
      if (diffToDate.status === 'error') {
        throw new Error(diffToDate.message)
      }      
      if (diffToDate.status !== 'ok') {
        return setWarning(diffToDate.message)
      }

      if (diffToDate.days < 0) {
        return setCustom('accountIsExpired')
      }
  
      if (!ignoreShouldChangePassword) {
        if (result.shouldChangePassword === 1) {
          return setCustom('shouldChangePassword')
        }
      }
      
      let data = {
        token,
        decryptedData: result
      }

      return setSuccess(data)
      
    } catch (error) {
      return setError(error)
    }
  // end of verify token function
  }
}

module.exports = Token