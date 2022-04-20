const path = require('path')
const dotenv = require('dotenv')
dotenv.config({ path: path.join(__dirname, '..', '.env') })

const config = require('./config/')

const express = require('express')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')

const routerHome = require('./routes/home')
const routerSignIn = require('./routes/signin')
const routerUser = require('./routes/user')

const app = express();
const port = process.env.APP_PORT || 3002

app.use(express.json());
app.use(express.json({
  type: ['application/json', 'text/plain']
}))

app.use(routerHome)
app.use('/signin', routerSignIn)
app.use('/user', routerUser)

const DB = require('./classes/DB')
const User = require('./classes/User')
const sql = require('./classes/SQLQueryBuilder')




async function main(){
    let checkLoginCredentials = new User()
    //checkLoginCredentials = await checkLoginCredentials.checkLoginCredentials('muhittin.yendun@au.indorama.net', '111')
    //console.log(checkLoginCredentials)
    let user = new User()
    //console.log(user.checkUserPassword('111', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im11aGl0dGluLnllbmR1bkBhdS5pbmRvcmFtYS5uZXQiLCJwYXNzd29yZCI6IiQyYSQxMCRxQlhLNU1iQ05TUkhLWGRkcnFhcjBPcC5sRFJVVm4uMXdUL3Y4QzRKOUYycXlqZWNsbldyNiIsImF2YXRhciI6IjEuamZpZiIsInNpdGUiOiJCb3RhbnkiLCJhY2NvdW50RXhwaXJlc0F0IjoiMjAyMi0wNC0yOVQxNDowMDowMC4wMDBaIiwic2hvdWxkQ2hhbmdlUGFzc3dvcmQiOjAsImlhdCI6MTY1MDI4MjA1MCwiZXhwIjoxNjUxNDkxNjUwfQ.1PZayQ8SjHeyn4sddQf6IHrrugg3oT2DAjJfSccqQgE'))

    //console.log(await user.updatePassword('muhittin.yendun@au.indorama.net', '222'))

    //const sendPasswordResetLinkResult = await user.emailResetPasswordLink('muhittin.yendun@au.indorama.net', 'http://localhost:3000/forgotpassword')

    //console.log(sendPasswordResetLinkResult)
}

main().catch(error => console.log('main function error ', error))

app.listen(port, () => {
  try {
      console.log(`listening at ${port} ...`);      
  } catch (error) {
      console.log(error);
  }   
});

process.on('SIGINT', () =>{
  console.log("\nExiting ...");
  //db.connection.end();
  console.log("\nExited ...");
  process.exit(0);   
});