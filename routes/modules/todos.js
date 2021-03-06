const express = require('express')
const router = express.Router()
const db = require('../../models')
const Todo = db.Todo

router.get('/create', (req, res) => res.render('create'))

router.post('/', (req, res) => {
  const UserId = req.user.id
  const { name } = req.body
  return Todo.create({ name, UserId })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

router.get('/:id', (req, res) => {
  const id = req.params.id
  const UserId = req.user.id
  return Todo.findOne({ where: { id, UserId } })
    .then(todo => {
      if (!todo) throw new Error('todo not found!')
      return res.render('detail', { todo: todo.toJSON() })
    })
    .catch(err => console.log(err))
})

router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  const UserId = req.user.id
  return Todo.findOne({ where: { id, UserId } })
    .then(todo => {
      if (!todo) throw new Error('todo not found!')
      return res.render('edit', { todo: todo.toJSON() })
    })
    .catch(err => console.log(err))
})

router.put('/:id', (req, res) => {
  const id = req.params.id
  const UserId = req.user.id
  const { name, isDone } = req.body
  return Todo.findOne({ where: { id, UserId } })
    .then(todo => {
      if (todo) {
        todo.name = name
        todo.isDone = isDone === 'on'
        return todo.save()
      }
      throw new Error('todo not found!')
    })
    .then(() => res.redirect(`/todos/${id}`))
    .catch(err => console.log(err))
})

router.delete('/:id', (req, res) => {
  const id = req.params.id
  const UserId = req.user.id
  return Todo.findOne({ where: { id, UserId } })
    .then(todo => {
      if (todo) return todo.destroy()
      throw new Error('todo not found!')
    })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

module.exports = router