const express = require("express");
const { default: mongoose } = require("mongoose");
const { Banks } = require("../db");
const router = express.Router();
const authMiddleware = require("../middleware");

router.get("/balance", authMiddleware, async (req, res) => {
  const wallet = await Banks.findOne({
    userId: req.userId,
  });
  if (!wallet) {
    return res.status(404).json({
      msg: "Account not found!",
    });
  }

  res.status(200).json({
    balance: wallet.balance,
  });
});

router.post("/transfer", authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  //Helps with the multi transaction req problem
  session.startTransaction();

  const { to, amount } = req.body;
  const account = await Banks.findOne({ userId: req.userId }).session(session);

  if (!account || account.balance < amount) {
    await session.abortTransaction();
    return res.status(401).json({
      msg: "Insufficient balance!",
    });
  }

  const toAccount = await Banks.findOne({ userId: req.userId }).session(
    session
  );
  if (!toAccount) {
    await session.abortTransaction();
    return res.status(401).json({
      msg: "Invalid Account details",
    });
  }

  await Banks.updateOne(
    { userId: req.userId },
    { $inc: { balance: -amount } }
  ).session(session);
  await Banks.updateOne({ userId: to }, { $inc: { balance: amount } }).session(
    session
  );

  session.commitTransaction();

  return res.status(200).json({
    msg: "Transaction successful",
  });
});

module.exports = router;
