const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const facebookStrategy = require('passport-facebook').Strategy
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(new localStrategy({ usernameField: 'email', passReqToCallback: true }, (req, email, password, done) => {
    User.findOne({ where: { email } })
      .then(user => {
        if (!user) return done(null, false, req.flash('error', 'That email is not registered!'))
        return bcrypt.compare(password, user.password)
          .then(isMatch => {
            if (!isMatch) return done(null, false, req.flash('error', 'Incorrect password!'))
            return done(null, user)
          })
      })
      .catch(err => done(err, false))
  }))

  passport.use(new facebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName']
  }, (accessToken, refreshToken, profile, done) => {
    const { email, name } = profile._json
    User.findOne({ where: { email } })
      .then(user => {
        if (user) return done(null, user)
        const randomPassword = Math.random().toString(36).slice(-8)
        return bcrypt
          .genSalt(10)
          .then(salt => bcrypt.hash(randomPassword, salt))
          .then(hash => User.create({
            name,
            email,
            password: hash
          }))
          .then(user => done(null, user))
          .catch(err => done(err, false))
      })
      .catch(err => done(err, false))
  }))

  passport.serializeUser((user, done) => done(null, user.id))

  passport.deserializeUser((id, done) => {
    User.findByPk(id)
      .then(user => {
        if (user) {
          user = user.toJSON()
          done(null, user)
        }
        return done(null, false)
      })
      .catch(err => done(err, null))
  })
}