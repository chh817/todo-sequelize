const express = require('express')
const router = express.Router()
const db = require('../../models')
const Todo = db.Todo

router.get('/:id', (req, res) => {
  const id = req.params.id
  const UserId = req.user.id
  return Todo.findOne({ where: { id, UserId } })
    .then(todo => {
      if (!todo) throw new Error('todo not found!')
      return res.render('detail', { todo: todo.JSON() })
    })
    .catch(err => console.log(err))
})

module.exports = router