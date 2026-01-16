const Room = require("../../models/Room/Room");
const { isMember, isAdmin } = require("../../utils/roompermissions");

const removeMember = async (req, res) => {
  try {
    const { roomId, memberDbId } = req.params;

    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (!isAdmin(room, req.user._id)) {
      return res.status(403).json({ message: "Admin access required" });
    }

    const member = isMember(room, memberDbId);

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    if (member.role === "admin") {
      return res.status(400).json({ message: "Cannot remove admin" });
    }

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
