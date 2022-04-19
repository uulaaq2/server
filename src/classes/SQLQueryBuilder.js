const { setSuccess } = require("../functions/setReply")

class SQLQueryBuilder {
        pieces = []
        values = []
    
        select(selectfields) {
            this.pieces.push(`SELECT ${selectfields}`)

            return this
        }

        update(tableName) {
            this.pieces.push(`UPDATE ${tableName}`)

            return this
        }

        set(setFields) {    
            let tempFields = []         
    
            for (let key in setFields) {
                if (setFields.hasOwnProperty(key)) {
                   tempFields.push(`${key}=?`)
                   this.values.push(setFields[key])
                }
            }
    
            if (tempFields.length > 0) {             
                this.pieces.push(`SET ${tempFields.join(',')}`)
            }

            return this
        }      
        
        table(tableName) {
            this.pieces.push(tableName)

            return this
        }
        
        from(tableName) {
            this.pieces.push(`FROM ${tableName}`)

            return this
        }
    
        where(whereFields) {    
            let tempFields = []         
    
            for (let key in whereFields) {
                if (whereFields.hasOwnProperty(key)) {
                   tempFields.push(`${key}=?`)
                   this.values.push(whereFields[key])
                }
            }
    
            if (tempFields.length > 0) {             
                this.pieces.push(`WHERE ${tempFields.join(' AND ')}`)
            }
            return this
        }
    
        get() {
            let data = {
                sqlStatement: this.pieces.join(' '),
                values: this.values
            }
            return setSuccess(data)
        }
}

module.exports = SQLQueryBuilder