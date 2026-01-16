const Room = require("../../models/Room/Room");
const Expense = require("../../models/Room/Expense");
const { isMember } = require("../../utils/roompermissions");

const getBalances = async (req, res) => {
  try {
    const { roomId } = req.params;
    const user_id = req.user._id;

    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (!isMember(room, user_id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const expenses = await Expense.find({ room: room._id });

    const balances = {};

    // Initialize balances
    room.members.forEach(member => {
      balances[member.user.toString()] = 0;
    });

    expenses.forEach(expense => {
      // Payer gets credit
      balances[expense.paidBy.toString()] += expense.amount;

      // Each participant owes their share
      expense.shares.forEach(share => {
        balances[share.user.toString()] -= share.amount;
      });
    });

    res.json(balances);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getBalances };
