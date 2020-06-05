const express = require('express');
const Suscriptions = require('../models/SuscriptionsModel');
const { VerifyToken, Verify_Admin_Role } = require('../middlewares/authentication');

const app = express();



// view Suscription
app.get('/suscriptions/all', (req, res) => {
    Suscriptions.find({}, (err, suscriptionDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'An error ocurred'
            });
        } else {
            res.json({
                ok: true,
                suscription: suscriptionDB
            });
        }
    });
});


// save suscription
app.post('/save/suscription', [VerifyToken, Verify_Admin_Role], (req, res) => {
    let body = req.body;

    let suscription = new Suscriptions({
        suscription: body.suscription,
        price: body.price
    });

    suscription.save((err, suscriptionDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err,
                message: 'An error ocurred'
            });
        } else {
            res.json({
                ok: true,
                suscription: suscriptionDB
            });
        }
    });

});


// update suscription
app.put('/update/suscription/:id', [VerifyToken, Verify_Admin_Role],(req, res) => {
    let id = req.params.id;
    let body = req.body;

    Suscriptions.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, suscriptionDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            });
        }

        if (!suscriptionDB) {
            return res.status(400).json({
                ok: false,
                menssage: 'this suscription not exist'
            });
        }


        res.json({
            ok: true,
            message: 'update of this suscription successful',
            suscription: suscriptionDB
        });
    });
});


module.exports = app;