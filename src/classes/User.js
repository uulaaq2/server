const { setError, setWarning, setSuccess } = require('../functions/setReply')
const DB = require('./DB')
const sqlQueryBuilder = require('./SQLQueryBuilder')
const Password = require('../classes/Password')
const Token = require('../classes/Token')

class User {

    // start of getUserByEmail function
    async getUserByEmail(emailAddress) {
        try {
            const db = new DB()            
            const sqlQuery = new sqlQueryBuilder()            
                                 .select('*')
                                 .from(process.env.TABLE_USERS)
                                 .where({Email: emailAddress})
                                 .get()
            
            const results = await db.query(sqlQuery.sqlStatement, sqlQuery.values)

            if (results.status === 'error') {
                throw new Error(results.message)
            }            

            if (results.status !== 'ok'){
                return results
            }

            if (results.results.length > 1) {
                return setWarning('Ambigious email address')
            }

            const data = {
                user: results.results[0]
            }
            
            return setSuccess(data)
        // end of try
        } catch (error) {
            return setError(error)
        // end of catch
        }

    // end of getUserByEmail function
    }

    prepareTokenFields(user) {
        try {
            const data = {
                userTokenFieldsData : {
                    email: user.Email,
                    password: user.Password,
                    avatar: user.Avatar,
                    site: user.Site,
                    accountExpiresAt: user.Expires_At,
                    shouldChangePassword: user.Should_Change_Password
                }
            }

            return setSuccess(data)
        } catch (error) {
            return setError(error)
        }
    }

    checkUserPasswordByToken(password, token) {
        try {
         const verifiedToken = new Token().verifyToken(token)
         if (verifiedToken.status === 'error') {
             throw new Error(verifiedToken.message)
         }
         if (verifiedToken.status !== 'ok') {
             return verifiedToken
         }

         const encryptedPassword = verifiedToken.decryptedData.password
         const verifiedPassword = new Password().decryptPassword(password, encryptedPassword)
         if (verifiedPassword.status === 'error') {
            throw new Error(verifiedPassword.message)    
         }

         if (verifiedPassword.status !== 'ok') {
             return verifiedPassword
         }

         return setSuccess()
        } catch (error) {
            return setError(error)
        }
    }

    async checkLoginCredentials(emailAddress, password) {
        try {
            const user = await this.getUserByEmail(emailAddress)
            if (user.status === 'error') {
                throw new Error(user.message)
            }

            if (user.status !== 'ok') {
                return user
            }

            let passwordVerified = new Password()
            passwordVerified = passwordVerified.decryptPassword(password, user.user.Password)
            if (passwordVerified.status === 'error') {
                throw new Error(passwordVerified.message)
            }
            
            const userTokenFieldsData = this.prepareTokenFields(user.user)
            if (userTokenFieldsData.status === 'error') {
                throw new Error(userTokenFieldsData.message)
            }
            if (userTokenFieldsData.status !== 'ok') {
                return userTokenFieldsData
            }

            let token = new Token()
            const tokenGenerated = token.generateToken(userTokenFieldsData.userTokenFieldsData)
            if (tokenGenerated.status !== 'ok') {
                return tokenGenerated
            }            

            const tokenVerified = token.verifyToken(tokenGenerated.token)
            if (tokenVerified.status !== 'ok') {
                return tokenVerified
            }

            const data = {
                token: tokenGenerated.token,
                user: user.user
            }


            return setSuccess(data)
        } catch (error) {
            return setError(error)
        }
    }

    async updatePassword(emailAddress, newPassword) {
        try {
            let encryptedPassword = new Password().encryptPassword(newPassword)
            const salt = encryptedPassword.salt
            encryptedPassword = encryptedPassword.encryptedPassword

            const sqlQuery = new sqlQueryBuilder()
                                 .update(process.env.TABLE_USERS)
                                 .set({ Password: encryptedPassword, Password2: newPassword, Salt: salt })
                                 .where({ Email: emailAddress })
                                 .get()

            let updatedPassword = new DB()
            updatedPassword = await updatedPassword.query(sqlQuery.sqlStatement, sqlQuery.values)
            if (updatedPassword.status === 'error') {
                throw new Error(updatedPassword.message)
            }

            if (updatedPassword.status !== 'ok') {
                return updatedPassword
            }
            return setSuccess()
        } catch (error) {
            return setError(error)
        }
    }
}

module.exports = User