const path = require('path')
const dotenv = require('dotenv')
dotenv.config({ path: path.join(__dirname, '..', '.env') })

const DB = require('./classes/DB')
const SQLQueryBuilder = require('./classes/SQLQueryBuilder')
const Fs = require('fs')

const db = new DB()

var fs = require('fs');
const SqlString = require('mysql/lib/protocol/SqlString')
var results = []
var aaa = [];

var walk = function(dir, done) {
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var i = 0;
    (function next() {
      var file = list[i++];
      if (!file) return done(null, results);
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            next();
          });
        } else {
          aaa.push(file);
          console.log(file)
          next();
        }
        
      });
    })();
  });
}

walk('\\\\aubyf202\\Groups\\HCA_BY\\sur_drawings\\LOOPS\\LOOP PDF\'S', function(err, results) {
  if (err) throw err;
  //console.log(results)
  addToDB()
});

async function addToDB() {

  
  for (var i=0; i < aaa.length; i++) {
    if (path.extname(aaa[i]) === '.pdf')  {      
      let sql = new SQLQueryBuilder()
      let sqlStatement = sql.insert('files').set({
        File_Name: path.basename(aaa[i]),
        File_Extension: path.extname(aaa[i]),
        Created_At: Fs.statSync(aaa[i]).birthtime,
        Modified_At: Fs.statSync(aaa[i]).mtime
      })
      .get()

      let result = await db.query(sqlStatement.sqlStatement, sqlStatement.values)

      console.log(i + ' - file added to mysql: ', aaa[i])
    }
  }
  console.log(i)
}


