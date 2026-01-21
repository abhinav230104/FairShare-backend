const Room = require("../../models/Room/Room");
const Expense = require("../../models/Room/Expense");
const { isAdmin, isMember } = require("../../utils/roompermissions");

const deleteExpense = async (req, res) => {
  try {
    const { roomId, expenseId } = req.params;
    const user_id = req.user._id;

    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (!isMember(room, user_id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (!isAdmin(room, user_id)) {
      return res.status(403).json({ message: "Admin access required" });
    }

    const expense = await Expense.findById(expenseId);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    if (expense.room.toString() !== room._id.toString()) {
      return res.status(400).json({
        message: "Expense does not belong to this room",
      });
    }

    await expense.deleteOne();

    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { deleteExpense };
