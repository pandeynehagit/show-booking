const jwt = require("jsonwebtoken");
const auth = (req,res,next)=>{
try{
   console.log("req.headers",req.headers.authorization);
   const token = req.headers.authorization.split(" ")[1];
   if (!token) {
    return res.status(401).send({
      success: false,
      message: "No token provided",
    });
  }
   console.log("token",token);
   const verifiedToken = jwt.verify(token,process.env.JWT_SECRET);
   if(!verifiedToken){
    console.log("not getting verified token");
   }
   console.log("verifiedToken payload :",verifiedToken);
   req.body.userId = verifiedToken.userId;//important
   next();
}
catch (err) {
  res.status(401).json({ message: "Token expired or invalid" });
}
};
module.exports = auth;