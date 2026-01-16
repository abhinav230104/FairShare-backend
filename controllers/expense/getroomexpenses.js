const Room = require("../../models/Room/Room");
const Expense = require("../../models/Room/Expense");
const { isMember } = require("../../utils/roompermissions");

const getRoomExpenses = async (req, res) => {
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

    const expenses = await Expense.find({ room: room._id })
      .populate("paidBy", "name userId")
      .populate("shares.user", "name userId")
      .sort({ createdAt: -1 });

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getRoomExpenses };
