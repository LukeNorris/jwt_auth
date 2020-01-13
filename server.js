// require('dotenv').config()
// const fs = require('fs')

// const express = require('express')
// const app = express()
// const jwt = require('jsonwebtoken')

// app.use(express.json())

// const posts = [
//   {
//     username: 'Kyle',
//     title: 'Post 1'
//   },
//   {
//     username: 'Jim',
//     title: 'Post 2'
//   }
// ]

// app.get('/posts', verify, (req, res) => {
//   res.json(posts.filter(post => post.username === req.user.name))
// })

// function verify(req, res, next) {
//   var verifyOptions = { algorithms: ["RS256"]};  
//   const publicKey = fs.readFileSync('./jwtRS256.key.pub','utf8');
//   const authHeader = req.headers['authorization']
//   const token = authHeader && authHeader.split(' ')[1]
//   if (token == null) return res.sendStatus(401)

//   jwt.verify(token, publicKey, verifyOptions, (err, user) => {
//     console.log(err)
//     if (err) return res.sendStatus(403)
//     req.user = user
//     next()
//   })
// }

// app.listen(3000)

//---------------

require('dotenv').config()
const fs = require('fs')

const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')

app.use(express.json())

const posts = [
  {
    username: 'Kyle',
    title: 'Post 1'
  },
  {
    username: 'Jim',
    title: 'Post 2'
  }
]

app.get('/posts', verify, (req, res) => {
  res.json(posts.filter(post => post.username === req.user.name))
})

function verify(req, res, next) {
  const verifyOptions = { algorithms: ["RS256"]};  
  const publicKey = fs.readFileSync('./jwtRS256.key.pub','utf8');
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, publicKey, verifyOptions, (err, user) => {
    console.log(err)
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

app.listen(3000)