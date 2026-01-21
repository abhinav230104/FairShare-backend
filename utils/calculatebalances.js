const Expense = require("../models/Room/Expense");

const calculateBalances = async (room) => {
  const expenses = await Expense.find({ room: room._id });

  const balances = {};

  // Create a set of room member IDs
  const memberSet = new Set(
    room.members.map(member => member.user.toString())
  );

  // Initialize balances ONLY for room members
  memberSet.forEach(userId => {
    balances[userId] = 0;
  });

  // Compute balances
  expenses.forEach(expense => {
    const payerId = expense.paidBy.toString();

    // Add amount only if payer is a room member
    if (memberSet.has(payerId)) {
      balances[payerId] += expense.amount;
    }

    expense.shares.forEach(share => {
      const userId = share.user.toString();

      // Subtract share only if user is a room member
      if (memberSet.has(userId)) {
        balances[userId] -= share.amount;
      }
    });
  });

  // Round to 2 decimals
  Object.keys(balances).forEach(userId => {
    balances[userId] = Math.round(balances[userId] * 100) / 100;
  });

  return balances;
};

module.exports = { calculateBalances };
