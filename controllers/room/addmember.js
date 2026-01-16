const Room = require("../../models/Room/Room");
const User = require("../../models/User");
const { isMember, isAdmin } = require("../../utils/roompermissions");

const addMember = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { userId } = req.body; // FairShare ID (nomad-XXXX)

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (!isAdmin(room, req.user._id)) {
      return res.status(403).json({ message: "Admin access required" });
    }

    const userToAdd = await User.findOne({ userId });
    if (!userToAdd) {
      return res.status(404).json({ message: "User not found" });
    }

    if (isMember(room, userToAdd._id)) {
      return res.status(400).json({ message: "User already a member" });
    }

    room.members.push({
      user: userToAdd._id,
      role: "member",
    });

    await room.save();

    res.json({ message: "Member added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {addMember};
