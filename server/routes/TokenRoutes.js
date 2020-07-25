const express = require('express')
const app = express();
const { VerifyToken } = require('../middlewares/authentication');


// check if the token exists and is not expired
app.get('/user', [VerifyToken], (req, res) => {
    const user = req.user;

    res.json({
        ok: true,
        user: user
    });
});



module.exports = app;