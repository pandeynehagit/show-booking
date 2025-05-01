
const UserModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const EmailHelper = require("../Util/emailHelper");
const bcrypt = require("bcrypt");

const createUser = async (req, res) => {
  try {
    //console.log("Request Body:", req.body); // Log incoming data

    const userExists = await UserModel.findOne({ email: req.body.email });
    if (userExists) {
      return res.send({
        success: false,
        message: "User already exists",
      });
    }
    const newUser = await UserModel(req.body);
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password,saltRounds);
    newUser.password = hashedPassword;
     await newUser.save();

    //console.log("Saved User:", savedUser); // Log saved user

    res.send({
      success: true,
      message: "User registered successfully",
    });
  } catch (err) {
    console.error("Error in register route:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

const readUser = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.send({
        success: false,
        message: "User not found",
      });
    }
    const isMatch = await bcrypt.compare(req.body.password,user.password);
    if (!isMatch) {
      return res.send({
        success: false,
        message: "Invalid password",
      });
    }

    console.log("req recieved",req.body,user);
    // const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"2s"});
    // console.log(token);
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "365d",
    });
    res.send({
      success: true,
      message: "User logged in successfully",
      data:token,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getCurrentUser =async(req,res)=>{
  try{
  const user = await UserModel.findById(req.body.userId).select("-password");
  if (!user) {
    return res.status(404).send({
      success: false,
      message: "User not found",
    });
  }
  console.log(user);
  res.send({
    success:true,
    message:"You are authorized to go to the protected route",
    data:user,
  });
}
catch(err){
  res.status(500).send({
    success: false,
    message: err.message,
  });
}
};
const generateOpt =()=>{
  const otp = Math.floor(Math.random()*100000)+90000;
  return otp;
};

const forgotPassword = async(req,res)=>{
  try{
    //1. ask email
    //2. email exist
       //2.1 if exist create and send otp
       //2.2 if not then send response email doesnot exist
     //3. generate otp and store in db 
     // response with otp  
     if(req.body.email === undefined){
      res.send({
        success:false,
        message:"email required",
      })
     }
     const user = await UserModel.findOne({email:req.body.email});
     if(!user){
      return res.send({
        success:false,
        message:"user does not exist"
      })
     }
     const otp = generateOpt();
     user.otp = otp;
     user.otpExpire = Date.now() + 5 *60*1000;
     await user.save();
     
     await EmailHelper("otp.html",user.email,{name:user.name,otp:user.otp},"OTP for BookMyShowClone");
     res.send({
      success:true,
      message:"otp send to registered email"
     })
  }catch(err){
    res.send({
    sucess:false,
    message:err.message})
  }
};

const resetPassword  =async (req,res)=>{
  try{
    const resetDetails = req.body;
    if(!resetDetails.password || !resetDetails.otp){
      return res.send({
        success:false,
        message:"Password and OTP are required"
      })
    }
    const user = await UserModel.findOne({otp:resetDetails.otp});
    if(!user){
      return res.send({
        success:false,
        message:"Invalid OTP"
      })
    }
    if(user.otpExpire < Date.now()){ //otp has expired
       return res.send({
        success:false,
        message:"OTP has expired"
       })
    }
    user.password = resetDetails.password;
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();
    res.send({
      success:true,
      message:"Password reset successful"
    })
  }catch(err){
    res.send({
      success:false,
      message:err.message
    })
  }
};
module.exports ={createUser,readUser,getCurrentUser,forgotPassword,resetPassword

}

