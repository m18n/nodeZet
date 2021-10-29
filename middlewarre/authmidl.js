const jwt=require('jsonwebtoken')
const config = require('../config')
module.exports=function(req,res,next){
    if(req.method==="OPTIONS"){
        next()
    }
    try{
        const token=req.cookies.token
        if(!token)
            return res.redirect('/adminzet')
        const decodeData=jwt.verify(token,config.secret)
        req.user=decodeData
        next()
    }catch(e){
        console.log(e);
        return res.redirect('/adminzet')
    }
}