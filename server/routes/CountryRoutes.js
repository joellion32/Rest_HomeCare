const express = require('express');
const app = express();
const CountryModel = require('../models/CountryModel');


// get countries
app.get('/get/countries', (req, res) => {
    CountryModel.find({})
    .exec((err, countryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'An error ocurred',
                error: err
            });
        }

        res.json({
          ok: true,
          countries: countryDB  
        })
    })
});


// view country for id
app.get('/view/countries/:id', (req, res) => {
let id = req.params.id;
console.log(id)
CountryModel.findById(id, (err, countryDB) => {
    if (err) {
       return res.status(500).json({
            ok: false,
            message: 'An error ocurred',
            error: err
        });
    }

    if (!countryDB) {
        return res.status(400).json({
            ok: false,
            message: 'this country not exist',
        });
    }
           
    res.json({
        ok: true,
        country: countryDB
    });
});
});

// save countries
app.post('/countries/save', (req, res) => {
    let body = req.body;
    let country = new CountryModel({
        country: body.country,
        provinces: body.provinces
    });

    country.save((err, countryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'An error ocurred',
                error: err
            });
        }

        res.json({
            ok: true,
            message: 'Country successfully registered',
            country: countryDB
        });
    })

});


module.exports = app;