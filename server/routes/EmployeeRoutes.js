const express = require('express');
const Employee = require('../models/EmployeeModel');
const profession = require('../models/ProfessionsModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { VerifyToken, Verify_Admin_Role } = require('../middlewares/authentication');

const app = express();


// register employee
app.post('/employee/register', (req, res) => {
    let body = req.body;


    let user = new Employee({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        telephone: body.telephone,
        country: body.country,
        city: body.city,
        zip_code: body.zip_code,
        location: body.location,
        profession: body.profession,
        description: body.description,
        id_suscription: body.id_suscription,
        status: false
    });

    user.save((err, UserDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err,
                message: 'An error occurred'
            });
        } else {
            res.json({
                ok: true,
                message: 'Successful user registration',
                user: UserDB
            });
        }
    });

});

// login
app.post('/employee/login', (req, res) => {
    let body = req.body;

    Employee.findOne({ email: body.email }, (err, UserDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            });
        }

        if (!UserDB) {
            return res.status(500).json({
                ok: false,
                message: 'the email or password is incorrect'
            });
        }


        if (!bcrypt.compareSync(body.password, UserDB.password)) {
            return res.status(500).json({
                ok: false,
                message: 'the email or password is incorrect'
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

// view all Employees
app.get('/employees/all', [VerifyToken, Verify_Admin_Role], (req, res) => {
    let page = req.query.page || 0;
    page = Number(page);

    Employee.find({ status: true })
        .skip(page)
        .limit(10)
        .exec((err, UserDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'An error ocurred',
                    error: err
                });
            } else {
                res.json({
                    ok: true,
                    users: UserDB
                });
            }
        });
});

// search Employees by professions and city
app.get('/search_c/employee/:query/:location', (req, res) => {

    let params = req.params.query;
    let location = req.params.location;

    let page = req.query.page || 0;
    page = Number(page);

    Employee.find({ profession: params, city: location, status: true })
        .skip(page)
        .limit(10)
        .exec((err, UserDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: err,
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
                user: UserDB
            })
        });


});


// search employes by zip code 
app.get('/search_z/employee/:service/:zip_code', (req, res) => {
   
    let service = req.params.service;
    let zip = req.params.zip_code;
    let page = req.query.page || 0;
    page = Number(page);

    Employee.find({ profession: service, zip_code: zip })
        .skip(page)
        .limit(10)
        .exec((err, employeeDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    error: err,
                    message: 'An error ocurred'
                });
            }

            if (!employeeDB) {
                return res.status(400).json({
                    ok: false,
                    message: 'there are no services for this location'
                });
            }

            res.json({
                ok: true,
                employees: employeeDB
            });

        });


}); // close function



// view employee for id
app.get('/employee/view/:id', (req, res) => {
    let id = req.params.id;


    Employee.findById(id, (err, UserDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'An error ocurred',
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
            user: UserDB
        });

    });
});


// update employee
app.put('/employee/update/:id', [VerifyToken], (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Employee.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, UserDB) => {
        if (err) {
            return res.status(500).json({
                ok: true,
                message: 'An error ocurred',
                error: err
            });
        }

        if (!UserDB) {
            return res.status(400).json({
                ok: false,
                message: 'The user not exist'
            });
        }


        res.json({
            ok: true,
            message: 'user successfully updated',
            user: UserDB
        });
    });
});


// delete employee 
app.delete('/employee/delete/:id', [VerifyToken], (req, res) => {
    let id = req.params.id;

    Employee.findByIdAndUpdate(id, { status: false }, { new: true }, (err, UserDB) => {
        if (err) {
            return res.status.json({
                ok: false,
                message: 'An error ocurred',
                error: err
            });
        }


        if (!UserDB) {
            return res.status(400).json({
                ok: false,
                message: 'The user not exist'
            });
        }


        res.json({
            ok: true,
            user: UserDB
        });
    })
});

/**********-------------------------------------ADMINISTRATOR-------------------------------------- */


// view delete user
// view all Employees
app.get('/employees/deletes', [VerifyToken, Verify_Admin_Role], (req, res) => {
    let page = req.query.page || 0;
    page = Number(page);

    Employee.find({ status: false })
        .skip(page)
        .limit(10)
        .exec((err, UserDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'An error ocurred',
                    error: err
                });
            } else {
                res.json({
                    ok: true,
                    users: UserDB
                });
            }
        });
});


module.exports = app;