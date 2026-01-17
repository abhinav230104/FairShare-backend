const Room = require("../../models/Room/Room");
const { getSettlementsForRoom } = require("../../utils/settlements");

const deleteRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findOne({ roomId });
    if (!room) return res.status(404).json({ message: "Room not found" });

    if (room.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only creator can delete room" });
    }

    const settlements = await getSettlementsForRoom(room);
    if (settlements.length > 0) {
      return res.status(400).json({
        message: "Settle all balances before deleting room",
      });
    }

    await room.deleteOne();

    res.json({ message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { deleteRoom };
