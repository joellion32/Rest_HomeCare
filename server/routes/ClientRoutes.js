const express = require('express');
const Client = require('../models/ClientModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { VerifyToken, Verify_Admin_Role } = require('../middlewares/authentication');

const app = express();



//register clients
app.post('/clients/register', (req, res) => {
  let body = req.body;

  let user = new Client({
    name: body.name,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    country: body.country,
    city: body.city,
    status: true,
    date_of_register: new Date()
  });


  user.save((err, UserDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        error: err,
        message: 'An error ocurred'
      });
    } else {
      res.json({
        ok: true,
        message: 'Successful user registration',
        user: UserDB
      })
    }
  });
});


// login clients 
app.post('/clients/login', (req, res) => {
  let body = req.body;

  Client.findOne({ email: body.email }, (err, UserDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        error: err,
        message: 'This user does not exist'
      });
    }

    if (!UserDB) {
      return res.status(500).json({
        ok: false,
        error: err,
        message: 'the email and password are incorrect'
      });
    }

    // for password
    if (!bcrypt.compareSync(body.password, UserDB.password)) {
      return res.status(500).json({
        ok: false,
        error: err,
        message: 'the email and password are incorrect'
      });
    }

    // generate token
    let token = jwt.sign({
      user: UserDB
    }, process.env.SEED, { expiresIn: process.env.EXP });

    // all the right process
    res.json({
      ok: true,
      user: UserDB,
      token: token
    });


  });
});

// view Client for id
app.get('/clients/view/:id', [VerifyToken], (req, res) => {
  let id = req.params.id;
  
  Client.find({ _id: id, status: true }, (err, UserDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        error: err,
        message: "error"
      });
    }

    if (!UserDB) {
      return res.status(400).json({
        ok: false,
        message: 'the user not exist'
      });
    }

    res.json({
      ok: true,
      user: UserDB
    });
  });
});


// update client
app.put('/clients/update/:id', [VerifyToken], (req, res) => {
  let id = req.params.id;
  let body = req.body;

  Client.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, UserDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: 'this user not exist',
        error: err
      });
    }

    if (!UserDB) {
      return res.status(400).json({
        ok: false,
        message: 'this user not exist'
      });
    }

    res.json({
      ok: true,
      message: 'update of this user successful',
      user: UserDB
    });

  });
});




/*----------------------------------------------ADMINISTRATOR----------------------------------------------------*/
// view clients all
app.get('/clients/all', [VerifyToken], (req, res) => {

let page = req.query.page || 0;
page = Number(page);

  
  Client.find({ status: true })
  .skip(page)
  .limit(50)
  .exec((err, UserDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        error: err,
        message: 'Empyty'
      });
    }
    else {
      res.json({
        ok: true,
        users: UserDB
      });
    }
  });
});


// delete client
app.delete('/clients/delete/:id', [VerifyToken], (req, res) => {
  let id = req.params.id;
  let ChangeStatus = {
    status: false
  }

  Client.findByIdAndUpdate(id, ChangeStatus, { new: true }, (err, UserDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: 'this user not exist'
      });
    }

    if (!UserDB) {
      return res.status(400).json({
        ok: false,
        message: 'this user not exist'
      });
    }

    res.json({
      ok: true,
      message: 'delete of this user successful',
      user: UserDB
    });

  });
});

module.exports = app;

