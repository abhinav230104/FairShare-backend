const Room = require("../../models/Room/Room");

// generating room id
const generateRoomId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i=0; i<4; i++)
  { 
    let ind= Math.floor(Math.random() * chars.length);
    code += chars.charAt(ind);
  }
  return `room-${code}`;
};

const createRoom = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Room name is required" });
    }

    let room;
    while (true) {
      try {
        room = new Room({
          roomId: generateRoomId(),
          name: name.trim(),
          createdBy: req.user._id,
          members: [
            {
              user: req.user._id,
              role: "admin",
            },
          ],
        });

        await room.save();
        break;
      } catch (error) {
        if (error.code === 11000 && error.keyPattern?.roomId) continue;
        throw error;
      }
    }

    res.status(201).json({
      message: "Room created successfully",
      roomId: room.roomId,
      name: room.name,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {createRoom};
