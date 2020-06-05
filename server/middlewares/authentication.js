const jwt = require('jsonwebtoken');


let VerifyToken = (req, res, next) => {
let token = req.get('token');

jwt.verify(token, process.env.SEED, (err, decoded) => {
if(err){
return res.status(400).json({
ok: false,
err    
})    
}

req.user = decoded.user;

next();
});
}


let Verify_Admin_Role = (req, res, next) => {
let user = req.user;

if(user.role == "ADMIN_ROLE"){
next();    
}else{
return res.status(500).json({
ok: false,
message: 'The user is not Administrator'
});    
}

}


module.exports = {
    VerifyToken,
    Verify_Admin_Role
}