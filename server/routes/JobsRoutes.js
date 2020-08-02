const express = require('express')
const app = express()
const { VerifyToken, Verify_Admin_Role } = require('../middlewares/authentication');
const Jobs = require('../models/JobsModel');



// request all jobs 
app.get('/get/jobs/:status', [VerifyToken, Verify_Admin_Role], (req, res) => {
    let page = req.query.page || 0;
    let status = req.params.status;
    page = Number(page);

    Jobs.find({status: status})
        .populate('employe_id', 'name')
        .populate('client_id', 'name')
        .skip(page)
        .limit(10)
        .exec((err, JobsDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'An error ocurred',
                    error: err
                });
            }

            res.json({
                ok: true,
                jobs: JobsDB
            });
        })
});


// request all jobs by client_id 
app.get('/clients/jobs/:id/:status', [VerifyToken], (req, res) => {
    let page = req.query.page || 0;
    let client_id = req.params.id;
    let status = req.params.status;
    page = Number(page);

    Jobs.find({ client_id: client_id, status: status })
        .populate('employe_id')
        .skip(page)
        .limit(10)
        .exec((err, JobsDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'An error ocurred',
                    error: err
                });
            }

            res.json({
                ok: true,
                jobs: JobsDB
            });
        })
});

// request all jobs by employe_id 
app.get('/employees/jobs/:id', (req, res) => {
    let page = req.query.page || 0;
    let employe_id = req.params.id;
    let status = req.params.status;

    page = Number(page);

    Jobs.find({ employe_id: employe_id, status: status })
        .populate('client_id')
        .skip(page)
        .limit(10)
        .exec((err, JobsDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'An error ocurred',
                    error: err
                });
            }

            res.json({
                ok: true,
                jobs: JobsDB
            });
        })
});


// get jobs by id
app.get('/view/jobs/:id', (req, res) => {
    let id = req.params.id;
    Jobs.findById(id)
        .populate('client_id')
        .populate('employe_id')
        .exec((err, JobsDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'An error ocurred',
                    error: err
                })
            }

            if(!JobsDB){
                return res.status(400).json({
                    ok: false,
                    message: 'The job not exist',
                }); 
            }
            
            res.json({
                ok: true,
                jobs: JobsDB
            });
        })

});

// save jobs
app.post('/jobs/save', [VerifyToken], (req, res) => {
    let body = req.body;
    let jobs = new Jobs({
        client_id: body.client_id,
        employe_id: body.employe_id,
        title: body.title,
        description: body.description,
        location: body.location,
        date_of_solicited: new Date().getDate(),
        status: 'PENDING'
    });

    jobs.save((err, JobsDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            });
        }
        res.json({
            ok: true,
            message: 'Job saved successfully',
            jobs: JobsDB
        });
    });
});



// cancel jobs
app.get('/cancel/jobs/:id', [VerifyToken], (req, res) => {
    let id = req.params.id;
    Jobs.findByIdAndUpdate(id, { status: 'CANCELLED' }, { new: true})
        .exec((err, JobsDB) => {
            if (err) {
                return res.status(500).json({
                    ok: true,
                    message: 'An error ocurred',
                    error: err
                });
            }

            if(!JobsDB){
                return res.status(400).json({
                    ok: false,
                    message: 'The job not exist',
                }); 
            }

            res.json({
                ok: true,
                message: 'Job cancelled',
                jobs: JobsDB
            })
        });
});

module.exports = app;