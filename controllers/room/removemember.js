const Room = require("../../models/Room/Room");
const { isMember, isAdmin } = require("../../utils/roompermissions");
const { calculateBalances } = require("../../utils/calculatebalances");

const removeMember = async (req, res) => {
  try {
    const { roomId, memberDbId } = req.params;
    const adminId = req.user._id.toString();

    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Only admin can remove members
    if (!isAdmin(room, adminId)) {
      return res.status(403).json({ message: "Admin access required" });
    }

    const member = isMember(room, memberDbId);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    // Prevent removing last member
    if (room.members.length === 1) {
      return res.status(400).json({
        message: "Cannot remove the only member of the room",
      });
    }

    // Prevent removing last admin
    if (member.role === "admin") {
      const adminCount = room.members.filter(
        m => m.role === "admin"
      ).length;

      if (adminCount === 1) {
        return res.status(400).json({
          message: "Cannot remove the last admin",
        });
      }
    }

    // 🔐 Balance check (individual)
    const balances = await calculateBalances(room);
    const memberBalance = balances[memberDbId] || 0;

    // Allow small tolerance (±1)
    if (Math.abs(memberBalance) > 1) {
      return res.status(400).json({
        message: "Member has unsettled balance",
        balance: memberBalance,
      });
    }

    // Remove member
    room.members = room.members.filter(
      m => m.user.toString() !== memberDbId
    );

    await room.save();

    res.json({ message: "Member removed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { removeMember };
