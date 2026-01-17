const Room = require("../../models/Room/Room");
const { isMember } = require("../../utils/roompermissions");
const { getSettlementsForRoom } = require("../../utils/settlements");

const getSettlements = async (req, res) => {
  try {
    const { roomId } = req.params;
    const user_id = req.user._id;

    const room = await Room.findOne({ roomId });
    if (!room) return res.status(404).json({ message: "Room not found" });

    if (!isMember(room, user_id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const settlements = await getSettlementsForRoom(room);

    res.json(
      settlements.map(s => ({
        ...s,
        amount: s.amount / 100, // paise → rupees
      }))
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getSettlements };
