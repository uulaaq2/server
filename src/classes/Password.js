const bcrypt = require('bcryptjs')
const { setError, setSuccess, setWarning } = require('../functions/setReply')

class Password {
  //start of encryptPassword function
  encryptPassword(password) {
    try {
      const salt = bcrypt.genSaltSync(10);
      const encryptedPassword = bcrypt.hashSync(password, salt);     

      const data = {
        salt,
        encryptedPassword
      }

      return setSuccess(data)
    } catch (error) {
      return setError(error)
    }
  // enf of encryptPassword function
  }

  // start of decryptPassword function
  decryptPassword(password, encryptedPassword) {
    try {
      if (bcrypt.compareSync(password, encryptedPassword)) {
        return setSuccess()
      } else {
        return setWarning('Invalid password')
      }
  
    } catch (error) {
      return setError(error)
    }
  // end of decryptPassword function
  }

// end of class
}

module.exports = Password