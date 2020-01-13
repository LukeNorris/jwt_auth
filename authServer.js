require('dotenv').config()
const fs = require('fs')

const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')

app.use(express.json())

let refreshTokens = []

app.post('/token', (req, res) => {
  const refreshToken = req.body.token
  if (refreshToken == null) return res.sendStatus(401)
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    const accessToken = generateAccessToken({ name: user.name })
    res.json({ accessToken: accessToken })
  })
})

app.delete('/logout', (req, res) => {
  refreshTokens = refreshTokens.filter(token => token !== req.body.token)
  res.sendStatus(204)
})

app.post('/login', (req, res) => {
  // Authenticate User

  const username = req.body.username
  const user = { name: username }
  

  const accessToken = generateAccessToken(user)
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
  refreshTokens.push(refreshToken)
  res.json({ accessToken: accessToken, refreshToken: refreshToken })
})

function generateAccessToken(user) {
  const signOptions = {algorithm: "RS256", expiresIn:  "30s",};
  const privateKey = fs.readFileSync('./jwtRS256.key','utf8');



  return jwt.sign(user, privateKey, signOptions )


}


app.listen(4000)


//-------------------------------

// const fs = require('fs')

// const express = require('express')
// const app = express()
// const jwt = require('jsonwebtoken')

// app.use(express.json())


// // Private Key (must read as utf8)
// var privateKey = fs.readFileSync('./jwtRS256.key','utf8');
// // Public Key (must read as utf8)
// // var publicKey = fs.readFileSync('./jwtRS256.key.pub','utf8');

// // Sample claims payload with user defined fields (this can be anything, but briefer is better):
// const user = 'Luke'

// // Populate with fields and data


// /*
//     Sign
// */

// console.log(" ");

// // Values for the rfc7519 fields

// // Expiration timespan: https://github.com/auth0/node-jsonwebtoken#token-expiration-exp-claim
// var exp = "24h";

// // JWT Token Options, see: https://tools.ietf.org/html/rfc7519#section-4.1 for the meaning of these
// // Notice the `algorithm: "RS256"` which goes with public/private keys
// var signOptions = {
  
   
//     algorithm: "RS256"
// };
// console.log("Options: " + JSON.stringify(signOptions));

// var token = jwt.sign(user, privateKey, signOptions);
// console.log("Token: " + token);

// app.listen(4000)
