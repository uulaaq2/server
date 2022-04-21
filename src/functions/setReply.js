const { type } = require('express/lib/response')

const showServerDevelopmentErrors = require('../config').showServerDevelopmentErrors

const setSuccess = (data = null) => {
    let reply ={
        status: 'ok'
    }
    if (data) {
        if (typeof(data) === 'object') {
            for (let key in data) {
                if (data.hasOwnProperty(key)) {
                   reply[key] = data[key]                   
                }
            }
        }        

        if (typeof(data) === 'array') {            
            reply.data = data
        }
    }       

    return reply
}

const setWarning = (message) => {
    return {
        status: 'warning',
        message: message
    }
}

const setCustom = (status, message = '', data = null)  => {
    let reply = {
        status,
        message
    }

    if (data) {
        if (typeof(data) === 'object') {
            for (let key in data) {
                if (data.hasOwnProperty(key)) {
                   reply[key] = data[key]                   
                }
            }
        }        

        if (typeof(data) === 'array') {            
            reply.data = data
        }
    }       

    return reply
}

const setError = (error) => {
    let reply = {
        status: 'error',
        message: error.message
    }

    if (showServerDevelopmentErrors) {
        reply.stack = error.stack
    }

    return reply
}

module.exports = {
    setSuccess,
    setWarning,
    setCustom,
    setError
}