const express = require("express");
const router = express.Router();

const authentication = require("../middlewares/authmiddleware");
const { addExpense } = require("../controllers/expense/addexpense");
const { getExpenses } = require("../controllers/expense/getexpenses");
const { getBalances } = require("../controllers/expense/getbalances");
const { getSettlements } = require("../controllers/expense/getsettlements");
const { deleteExpense } = require("../controllers/expense/deleteexpense");

router.post("/:roomId/addExpense", authentication, addExpense);
router.get("/:roomId/getExpense",authentication,getExpenses);
router.get("/:roomId/getBalance",authentication,getBalances);
router.get("/:roomId/getSettlement",authentication,getSettlements);
router.delete("/:roomId/deleteExpense/:expenseId",authentication,deleteExpense);

module.exports = router;
