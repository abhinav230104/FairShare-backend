const Room = require("../../models/Room/Room");
const { isMember } = require("../../utils/roompermissions");

const leaveRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const user_id = req.user._id;

    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const member = isMember(room, user_id);
    if (!member) {
      return res.status(403).json({ message: "Not a room member" });
    }

    // Prevent last admin from leaving
    if (member.role === "admin") {
      const adminCount = room.members.filter(
        m => m.role === "admin"
      ).length;

      if (adminCount === 1) {
        return res.status(400).json({
          message: "Last admin cannot leave the room"
        });
      }
    }

    room.members = room.members.filter(
      m => m.user.toString() !== user_id.toString()
    );

    await room.save();

    res.json({ message: "Left room successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { leaveRoom };
