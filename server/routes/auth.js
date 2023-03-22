import bcryptjs from "bcryptjs";
import { Router } from "express";
import Jwt from "jsonwebtoken";
import User from "../model/user.js";
import RegisterValidation from "../validation/registerValidation.js";
import LoginValidation from "../validation/loginValidation.js";

const router = Router();

router.post("/register", async (req, res) => {
  //checking if the request has the specifications needed for the database
  const { error } = RegisterValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  //checking if the email is checked in
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) {
    return res.status(400).send("Email was already registered");
  }

  //hash the password
  const salt = await bcryptjs.genSalt(10);
  const hashPassword = await bcryptjs.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword,
  });
  try {
    const savedUser = await user.save();
    res.status(200).json({ status: "Successful" });
  } catch (error) {
    console.log("Error found: ", error);
    res.status(400).json({ status: "Error" });
  }
});

router.post("/login", async (req, res) => {
  //check request details
  const { error } = LoginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check if the email is registered
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email is not registered");

  //check if the password is correct
  const validPass = await bcryptjs.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Password is incorrect");

  //assign token
  const token = Jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).send(token);
});

export default router;
