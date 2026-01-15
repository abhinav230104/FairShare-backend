const Room = require("../../models/Room/Room");

const joinRoom = async (req, res) => {
  try {
    const { roomId } = req.body;

    if(!roomId)
    {
      return res.status(400).json({ message: "Room ID is required" });
    }

    const room = await Room.findOne({ roomId });
    if(!room)
    {
      return res.status(404).json({ message: "Room not found" });
    }

    const alreadyMember = room.members.some(
      (m)=> m.user.toString() === req.user._id.toString()
    );

    if(alreadyMember)
    {
      return res.status(400).json({ message: "Already a member of this room" });
    }

    room.members.push({
      user: req.user._id,
      role: "member",
    });

    await room.save();

    res.json({ message: "Joined room successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {joinRoom};
