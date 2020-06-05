// imports
require('../server/config/config');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const ClientRoutes = require('../server/routes/ClientRoutes')
const EmployeeRoutes = require('../server/routes/EmployeeRoutes')
const UploadsRoute = require('../server/routes/UploadsRoute')
const SuscriptionsRoutes = require('../server/routes/SuscriptionsRoutes')
const ProfessionRoutes = require('../server/routes/ProfessionRoutes')
const CategoryRoutes =  require('../server/routes/CategoryRoutes')
const mongoose = require('mongoose');

// variables
const app = express()
const port = process.env.PORT;



// configuration
app.use(express.static(path.resolve(__dirname, '../public')));

// connect BD
mongoose.connect(process.env.URLDB, (err, res) => {

    if (err) throw err;

    console.log('BD ONLINE');

});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


// routes 
app.use(ClientRoutes);
app.use(EmployeeRoutes);
app.use(UploadsRoute);
app.use(SuscriptionsRoutes);
app.use(ProfessionRoutes);
app.use(CategoryRoutes);

app.listen(port, () => console.log(`Example app listening on port port: ${port}!`))