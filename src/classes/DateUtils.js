const { setError, setSuccess } = require('../functions/setReply')

class DateUtils {
  // function: difference between two days
  diffToDate(toDate) {
    try {
      const today = new Date();
      const difference = new Date(toDate).getTime() - today.getTime()
      const days = Math.ceil(difference / (1000 * 3600 * 24));      

      const data = {
        days
      }

      return setSuccess(data)
    } catch (error) {
        return setError(error)
    }
  // end of difference between two days function
  }
// end of class
}

module.exports = DateUtils