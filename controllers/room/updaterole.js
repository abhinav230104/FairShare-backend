const Room = require("../../models/Room/Room");
const { isMember, isAdmin } = require("../../utils/roompermissions");

const updateRole = async (req, res) => {
  try {
    const { roomId, memberDbId } = req.params;
    const { role } = req.body;

    if (!["admin", "member"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

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
    
    // prevent changing creator role
    if (memberDbId.toString() === room.createdBy.toString()) {
      return res
        .status(403)
        .json({ message: "Creator role cannot be changed" });
    }

    // prevent removing last admin
    if (member.role === "admin" && role === "member") {
      const adminCount = room.members.filter(
        m => m.role === "admin"
      ).length;

      if (adminCount === 1) {
        return res
          .status(400)
          .json({ message: "Room must have at least one admin" });
      }
    }

    member.role = role;
    await room.save();

    res.json({ message: "Role updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { updateRole };
