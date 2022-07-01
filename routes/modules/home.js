const express = require('express')
const router = express.Router()
const db = require('../../models')
const Todo = db.Todo
const User = db.User

router.get('/', (req, res) => {
  console.log(req)
  const UserId = req.user.id
  User.findByPk(UserId)
    .then(user => {
      if (!user) throw new Error('user not found!')
      return Todo.findAll({
        raw: true,
        nest: false,
        where: { UserId }
      })
        .then(todos => res.render('index', { todos }))
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
})

module.exports = router