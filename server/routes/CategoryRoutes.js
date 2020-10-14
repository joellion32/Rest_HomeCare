const express = require('express');
const CategoryModel = require('../models/CategoryModel')
const { VerifyToken, Verify_Admin_Role } = require('../middlewares/authentication');

const app = express();



/**------------------------------REQUEST USER-------------------------------- */
app.get('/get/categories', (req, res) => {

    CategoryModel.find({})
        .exec((err, categoryDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'An error ocurred'
                });
            } else {
                res.json({
                    ok: true,
                    categories: categoryDB
                });
            }
        });
});


/*-----------------------------REQUEST ADMIN------------------------------------------*/

// save categories 
app.post('/save/categories', [VerifyToken, Verify_Admin_Role],(req, res) => {
    let body = req.body;

    let category = new CategoryModel({
        name_category: body.name_category
    });

    category.save((err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'An error ocurred',
                error: err
            });
        } else {
            res.json({
                ok: true,
                message: 'the category has been successfully registered',
                category: categoryDB
            });
        }
    });
});


// update categories
app.put('/categories/update/:id', [VerifyToken, Verify_Admin_Role], (req, res) => {
    let id = req.params.id;
    let body = req.body;

    CategoryModel.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'An error ocurred',
                error: err
            });
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                message: 'this category not exist'
            });
        }

        res.json({
            ok: true,
            message: 'the category has been successfully updated',
            category: categoryDB
        });
    });
});


module.exports = app;