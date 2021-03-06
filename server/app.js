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
const CountryRoutes =  require('../server/routes/CountryRoutes')
const TokenRoutes =  require('../server/routes/TokenRoutes')
const JobsRoutes =  require('../server/routes/JobsRoutes')

const mongoose = require('mongoose');
const cors = require('cors');

// variables
const app = express()
const port = process.env.PORT;



// configuration
app.use(express.static(path.resolve(__dirname, '../public')));

// connect BD
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true}, (err, res) => {

    if (err) throw err;

    console.log('BD ONLINE');

});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


// use cors
app.use(cors({origin: true, credentials: true}));


process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', promise, 'reason:', reason);
    // Application specific logging, throwing an error, or other logic here
});

// routes 
app.use(ClientRoutes);
app.use(EmployeeRoutes);
app.use(UploadsRoute);
app.use(SuscriptionsRoutes);
app.use(ProfessionRoutes);
app.use(CategoryRoutes);
app.use(CountryRoutes);
app.use(TokenRoutes);
app.use(JobsRoutes);

app.listen(port, () => console.log(`Example app listening on port port: ${port}!`))