const express= require("express")
const router= express.Router();

const {signup}= require("../controllers/auth/signup")
const {login}= require("../controllers/auth/login");
const { updateProfile } = require("../controllers/auth/updateprofile");
const authentication = require("../middlewares/authmiddleware");

router.post("/signup",signup);
router.post("/login",login);
router.patch("/updateProfile",authentication,updateProfile);
module.exports= router;