const express = require('express')
const router = express.Router()
const passport = require('passport')
const db = require('../../models')
const User = db.User
const bcrypt = require('bcryptjs')

router.get('/login', (req, res) => res.render('login'))

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []
  if (!name || !email || !password || !confirmPassword) {
    return errors.push({ message: '所有欄位都是必填。' })
  } else if (password !== confirmPassword) {
    return errors.push({ message: '密碼與確認密碼不相符！' })
  } else if (errors.length) {
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    })
  }
  User.findOne({ where: { email } })
    .then(user => {
      if (user) {
        errors.push({ message: '這個 Email 已經註冊過了。' })
        return res.render('register', {
          errors,
          name,
          email,
          password,
          confirmPassword
        })
      }
      return bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => User.create({
          name,
          email,
          password: hash
        }))
        .then(() => redirect('/'))
    })
    .catch(err => console.log(err))
})

module.exports = router