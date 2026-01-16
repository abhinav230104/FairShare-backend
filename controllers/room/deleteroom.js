const Room = require("../../models/Room/Room");

const deleteRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Only creator can delete (strongest rule)
    if (room.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only creator can delete room" });
    }

    /**
     * 🚧 FUTURE (Day 7–8)
     * if (!room.isSettled) {
     *   return res.status(400).json({ message: "Settle balances before deleting room" });
     * }
     */

    await room.deleteOne();

    res.json({ message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { deleteRoom };
