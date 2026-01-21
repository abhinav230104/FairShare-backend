const Room = require("../../models/Room/Room");

const getMyRooms = async (req, res) => {
  try {
    const rooms = await Room.find({
      "members.user": req.user._id,
    }).select("roomId name members");

    const result = rooms.map(room => {
      const member = room.members.find(
        m => m.user.toString() === req.user._id.toString()
      );

      return {
        roomId: room.roomId,
        name: room.name,
        role: member.role,
        members: room.members.length,
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {getMyRooms};
