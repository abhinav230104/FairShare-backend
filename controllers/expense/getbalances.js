const Room = require("../../models/Room/Room");
const { isMember } = require("../../utils/roompermissions");
const { calculateBalances } = require("../../utils/calculatebalances");

const getBalances = async (req, res) => {
  try {
    const { roomId } = req.params;
    const user_id = req.user._id;

    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (!isMember(room, user_id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const balances = await calculateBalances(room);

    res.json(balances);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getBalances };
