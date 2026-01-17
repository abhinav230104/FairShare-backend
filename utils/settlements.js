const Expense = require("../models/Room/Expense");

const getSettlementsForRoom = async (room) => {
  const expenses = await Expense.find({ room: room._id });

  const balances = {};

  room.members.forEach(m => {
    balances[m.user.toString()] = 0;
  });

  expenses.forEach(exp => {
    balances[exp.paidBy.toString()] += Math.round(exp.amount * 100);

    exp.shares.forEach(share => {
      balances[share.user.toString()] -= Math.round(share.amount * 100);
    });
  });

  const creditors = [];
  const debtors = [];

  for (const user_id in balances) {
    if (balances[user_id] > 0) {
      creditors.push({ user_id, amount: balances[user_id] });
    } else if (balances[user_id] < 0) {
      debtors.push({ user_id, amount: -balances[user_id] });
    }
  }

  let i = 0, j = 0;
  const settlements = [];

  while (i < debtors.length && j < creditors.length) {
    const pay = Math.min(debtors[i].amount, creditors[j].amount);

    settlements.push({
      from: debtors[i].user_id,
      to: creditors[j].user_id,
      amount: pay,
    });

    debtors[i].amount -= pay;
    creditors[j].amount -= pay;

    if (debtors[i].amount === 0) i++;
    if (creditors[j].amount === 0) j++;
  }

  return settlements;
};

module.exports = { getSettlementsForRoom };
