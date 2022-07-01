const express = require('express')
const session = require('express-session')
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')
const app = express()
const usePassport = require('./config/passport')
const PORT = process.env.PORT || 3000
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const db = require('./models')
const Todo = db.Todo
const User = db.User
const flash = require('connect-flash')
const routes = require('./routes')

app.use(express.urlencoded({ extended: true }))

app.use(methodOverride('_method'))

app.engine('hbs', engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(express.static("public"))

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

usePassport(app)

app.use(flash())

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  res.locals.error = req.flash('error')
  next()
})

app.use(routes)

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})