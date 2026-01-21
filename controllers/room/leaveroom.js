const Room = require("../../models/Room/Room");
const { isMember } = require("../../utils/roompermissions");
const { calculateBalances } = require("../../utils/calculatebalances");

const leaveRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user._id.toString();

    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const member = isMember(room, userId);
    if (!member) {
      return res.status(403).json({ message: "Not a room member" });
    }

    // 1️⃣ Check individual balance
    const balances = await calculateBalances(room);
    const userBalance = balances[userId] || 0;

    if (Math.abs(userBalance) > 1) {
      return res.status(400).json({
        message: "Please settle your balance before leaving room",
        balance: userBalance,
      });
    }

    // 2️⃣ If last member → auto delete room
    if (room.members.length === 1) {
      await room.deleteOne();
      return res.json({
        message: "Room deleted as last member left",
      });
    }

    // 3️⃣ Admin safety check
    if (member.role === "admin") {
      const adminCount = room.members.filter(
        m => m.role === "admin"
      ).length;

      if (adminCount === 1) {
        return res.status(400).json({
          message: "Last admin cannot leave the room",
        });
      }
    }

    // 4️⃣ Remove member
    room.members = room.members.filter(
      m => m.user.toString() !== userId
    );

    await room.save();

    res.json({ message: "Left room successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { leaveRoom };
