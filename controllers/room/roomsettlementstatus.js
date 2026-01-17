const Room = require("../../models/Room/Room");
const { getSettlementsForRoom } = require("../../utils/settlements");

const roomSettlementStatus = async (req, res) => {
  const room = await Room.findOne({ roomId: req.params.roomId });
  if (!room) return res.status(404).json({ message: "Room not found" });

  const settlements = await getSettlementsForRoom(room);

  res.json({
    isSettled: settlements.length === 0,
  });
};

module.exports = { roomSettlementStatus };
