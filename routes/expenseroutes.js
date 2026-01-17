const express = require("express");
const router = express.Router();

const authentication = require("../middlewares/authmiddleware");
const { addExpense } = require("../controllers/expense/addexpense");
const { getRoomExpenses } = require("../controllers/expense/getroomexpenses");
const { getBalances } = require("../controllers/expense/getbalances");
const { getSettlements } = require("../controllers/expense/getsettlements");

router.post("/:roomId/addExpense", authentication, addExpense);
router.get("/:roomId/getExpense",authentication,getRoomExpenses);
router.get("/:roomId/getBalance",authentication,getBalances);
router.get("/:roomId/getSettlement",authentication,getSettlements);
module.exports = router;
