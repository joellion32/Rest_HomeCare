const express = require('express');
const Professions = require('../models/ProfessionsModel');
const { VerifyToken, Verify_Admin_Role } = require('../middlewares/authentication');


const app = express();



/*-----------------------------------------------REQUEST USER-------------------------------*/

// view all professions
app.get('/professions/all', [VerifyToken], (req, res) => {
    let page = req.query.page || 0;
    page = Number(page);


    Professions.find({})
        .populate('category_id', 'name_category')
        .limit(20)
        .skip(page)
        .exec((err, professionDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'An error ocurred',
                    error: err
                });
            } else {
                res.json({
                    ok: true,
                    professions: professionDB
                });
            }
        });
});


// search professions
app.get('/search/professions/:query', (req, res) => {
    // search for word
    let params = req.params.query;
    let regex = new RegExp(params, 'i');
    let page = req.query.page || 0;
    page = Number(page);

    Professions.find({ name_profession: regex })
        .limit(20)
        .skip(page)
        .exec((err, professionDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'An error ocurred',
                    error: err
                });
            }

            if (!professionDB) {
                return res.status(400).json({
                    ok: false,
                    message: 'this profession not exist'
                });
            }

            res.json({
                ok: true,
                profession: professionDB
            });
        });

});


/*-----------------------------------------------REQUEST ADMINISTRATOR-------------------------------*/

//save professiones
app.post('/professions/save', [VerifyToken, Verify_Admin_Role], (req, res) => {
    let body = req.body;

    let profession = new Professions({
        name_profession: body.name_profession,
        description: body.description,
        category_id: body.category_id
    });


    profession.save((err, professionDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'An error ocurred',
                error: err
            });
        } else {
            res.json({
                ok: true,
                profession: professionDB
            });
        }
    });
});

// update profession 
app.put('/professions/update/:id', [VerifyToken, Verify_Admin_Role], (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Professions.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, professionDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'An error ocurred'
            });
        }

        if (!professionDB) {
            return res.status(400).json({
                ok: false,
                message: 'the profession not exist'
            });
        }

        res.json({
            ok: true,
            message: 'profession successfully updated',
            profession: professionDB
        });
    });
});




module.exports = app;