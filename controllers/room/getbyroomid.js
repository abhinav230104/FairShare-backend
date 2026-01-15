const Room = require("../../models/Room/Room");

const getByRoomId = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findOne({ roomId })
      .populate("createdBy", "name userId")
      .populate("members.user", "name userId");

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const isMember = room.members.some(
      m => m.user._id.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {getByRoomId};
