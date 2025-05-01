const express = require("express");

const authMiddleware= require("../middlewares/authMiddleware");
const{createUser,readUser,getCurrentUser,forgotPassword,resetPassword}= require("../controllers/userController")
const usersRouter = express.Router();


// register an user
usersRouter.post("/register", createUser);



usersRouter.post("/login", readUser);

usersRouter.get("/get-current-user",authMiddleware,getCurrentUser);
usersRouter.patch("/forgot-password",forgotPassword);
usersRouter.patch("/reset-password",resetPassword);
module.exports = usersRouter;