// Environment Variables

process.env.PORT = process.env.PORT || 3000;


// MONGO DB
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let UrlDB;

if(process.env.NODE_ENV === 'dev'){
    UrlDB = "mongodb://localhost:27017/homecare";
}else{
    UrlDB = "mongodb+srv://joellion32:joellion32@cluster0-ix6qp.mongodb.net/home-care?retryWrites=true&w=majority";
}

process.env.URLDB = UrlDB;


// SEED TOKEN 
process.env.SEED = process.env.SEED || 'secret-token-pass';


// expire token
process.env.EXP = '48h';