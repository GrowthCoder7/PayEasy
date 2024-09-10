const express = require("express");
const router = express.Router();
const { signUpWare, signInWare, UpdateWare } = require("../types");
const { Users, Banks } = require("../db");
const jwt = require("jsonwebtoken");
const { default: JwT_sec } = require("../config");
const { default: authMiddleware } = require("../middleware");

router.post("/signup", async (req, res) => {
  const { success } = signUpWare.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      msg: "Wrong Inputs",
    });
  }

  const existingUser = await Users.findOne({
    email: req.body.email,
  });
  if (existingUser) {
    return res.status(411).json({
      msg: "User already exists",
    });
  }

  const newUser = await Users.create({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: req.body.password,
  });
  const userId = Users._id;
  const token = jwt.sign({ id }, JwT_sec);

  //
  await Banks.create({
    id,
    balance: Math.random() * 10000,
  });

  return res.json({
    msg: "New User registered successfully",
    token: token,
  });
});

router.post("/signin", async (req, res) => {
  const { success } = signInWare.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      msg: "Wrong Inputs!",
    });
  }

  const user = await Users.findOne({
    email: req.body.email,
    password: req.body.password,
  });

  const userId = Users._id;
  if (user) {
    const token = jwt.sign({ id }, JwT_sec);
    return res.json({
      token: token,
    });
  }

  return res.status(404).json({
    msg: "User not found!",
  });
});

//Click nhi kiya tha
router.put("/update", authMiddleware, async (req, res) => {
  const { success } = UpdateWare.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      msg: "Error while updating the information!",
    });
  }

  await Users.updateOne({ _id: req.userId }, req.body);
  return res.status(200).json({
    msg: "Updated successfully",
  });
});

//Click nhi kiya tha
router.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";
  const allUsers = await Users.find({
    $or: [
      {
        firstname: {
          $regex: filter,
        },
      },
      {
        lastname: {
          $regex: filter,
        },
      },
    ],
  });

  res.status(200).json({
    users: allUsers.map((user) => {
      email: user.email;
      firstname: user.firstname;
      lastname: user.lastname;
      _id: user._id;
    }),
  });
});
module.exports = router;
