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
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)

  console.log(process.env.ACCESS_TOKEN_PUBLICKEY)
  jwt.verify(token, process.env.ACCESS_TOKEN_PUBLICKEY, {algorithm: ['RS256']}, (err, user) => {
    console.log(err)
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

app.listen(3000)