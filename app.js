const express = require('express')
const session = require('express-session')
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')
const app = express()
const usePassport = require('./config/passport')
const PORT = 3000 || process.env.PORT
const db = require('./models')
const Todo = db.Todo
const User = db.User
const routes = require('./routes')

app.use(session({
  secret: 'ThisIsNotYourSecret',
  resave: false,
  saveUninitialized: true
}))

usePassport(app)

app.use(express.urlencoded({ extended: true }))

app.use(methodOverride('_method'))

app.engine('hbs', engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')


app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  next()
})

app.use(routes)

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})