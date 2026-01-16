const Room = require("../../models/Room/Room");
const Expense = require("../../models/Room/Expense");
const { isAdmin } = require("../../utils/roompermissions");

const addExpense = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { title, amount, participants, payer_id, category } = req.body;
    const admin_id = req.user._id;

    if (!title || typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({ message: "Invalid title or amount" });
    }

    if (!Array.isArray(participants) || participants.length === 0) {
      return res.status(400).json({ message: "Participants are required" });
    }

    if (!payer_id) {
      return res.status(400).json({ message: "Payer_id is required" });
    }

    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Only admin can add expense
    if (!isAdmin(room, admin_id)) {
      return res.status(403).json({ message: "Admin access required" });
    }

    // Room member IDs
    const roomMember_ids = room.members.map(
      m => m.user.toString()
    );

    // Validate payer is a room member
    if (!roomMember_ids.includes(payer_id)) {
      return res.status(400).json({
        message: "Payer must be a room member",
      });
    }

    // Remove duplicate participants
    const uniqueParticipants = [...new Set(participants)];

    // Validate all participants are room members
    const invalidParticipants = uniqueParticipants.filter(
      id => !roomMember_ids.includes(id)
    );

    if (invalidParticipants.length > 0) {
      return res.status(400).json({
        message: "All participants must be room members",
      });
    }

    // Equal split
    const splitAmount = Number(
      (amount / uniqueParticipants.length).toFixed(2)
    );

    const shares = uniqueParticipants.map(user_id => ({
      user: user_id,
      amount: splitAmount,
    }));

    const expense = await Expense.create({
      room: room._id,
      title: title.trim(),
      amount,
      paidBy:payer_id,
      category: category?.trim() || undefined,
      shares,
    });

    res.status(201).json({
      message: "Expense added successfully",
      expense,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addExpense };
