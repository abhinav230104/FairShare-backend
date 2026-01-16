const express = require("express");
const router = express.Router();

const authentication = require("../middlewares/authmiddleware");
const { addExpense } = require("../controllers/expense/addexpense");
const { getRoomExpenses } = require("../controllers/expense/getroomexpenses");
const { getBalances } = require("../controllers/expense/getbalances");

router.post("/:roomId/addExpense", authentication, addExpense);
router.get("/:roomId/getExpense",authentication,getRoomExpenses);
router.get("/:roomId/getBalance",authentication,getBalances);

module.exports = router;
