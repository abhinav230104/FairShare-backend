const Room = require("../../models/Room/Room");
const { isAdmin } = require("../../utils/roompermissions");

const updateRoomName = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Room name is required" });
    }
    if (name.trim().length < 2) {
      return res.status(400).json({
        message: "Name must be at least 2 characters long",
      });
    }
    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (!isAdmin(room, req.user._id)) {
      return res.status(403).json({ message: "Admin access required" });
    }
    
    room.name = name.trim();
    await room.save();

    res.json({
      message: "Room name updated successfully",
      room: {
        roomId: room.roomId,
        name: room.name,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { updateRoomName };
