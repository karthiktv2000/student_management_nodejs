/* eslint-disable consistent-return */
const express = require('express');
const bcrypt = require('bcrypt');
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config();

const jwtExpirySeconds = 100;

const app = express();
app.set('view engine', 'hbs');
app.use(express.json());
app.use(cookieParser());
app.use(bodyparser.urlencoded({ extended: false }));

require('./db/dbConnection');
const model = require('./models/student');

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/register.html'));
});

app.post('/add', async (req, res) => {
  const n = req.body.email;
  model.findOne({ email: n }, { email: 1, _id: 0 }, async (err, data) => {
    if (data == null) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
      model.insertMany(req.body);
      res.send(`student with Email ${n} added successfuly`);
    } else {
      res.send(`student with Email ${n} is already present`);
    }
  });
});

app.get('/students', async (req, res) => {
  const s = await model.find({});
  res.send(s);
});

app.delete('/delete/:name', async (req, res) => {
  const n = req.params.name;
  await model.findOneAndRemove({ name: n });
  res.send(`${n} deleted successfuly`);
});

app.get('/update', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/update.html'));
});

app.post('/karthik', async (req, res) => {
  const pmail = req.body.upmail;
  model.findOneAndUpdate(
    { email: pmail },
    {
      $set: {
        semister: req.body.semister,
        phone: req.body.phone,
        branch: req.body.branch,
        address: req.body.address,
      },
    },
    { new: true },
    (err, data) => {
      if (data == null) {
        res.send('user email not found in database');
      } else {
        res.send(data);
      }
    },
  );
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/login.html'));
});

app.post('/login', (req, res) => {
  const e = req.body.upmail;
  const p = req.body.password;
  model.find({ email: e }, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      bcrypt.compare(p, result[0].password, (error, data) => {
        if (data) {
          const token = jwt.sign({ e, p }, process.env.jwtKey, { algorithm: 'HS256', expiresIn: jwtExpirySeconds });
          res.cookie('token', token);
          res.render('user.hbs', {
            kar: result[0].name,
          });
        } else {
          return res.status(401).json({ msg: 'Invalid credencial' });
        }
      });
    }
  });
});

app.get('/home', (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).end();
  }
  const payload = jwt.verify(token, process.env.jwtKey);
  res.render('user', {
    kar: payload.e,
  });
});

app.get('/logout', (req, res) => {
  const t = req.cookies.token;
  res.clearCookie(t);
  console.log(t);
  res.sendFile(path.join(__dirname, '/public/login.html'));
});

app.listen(3000);
