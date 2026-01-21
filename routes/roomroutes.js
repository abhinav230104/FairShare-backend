const express = require("express");
const router = express.Router();

const authentication = require("../middlewares/authmiddleware");
const {createRoom} = require("../controllers/room/createroom");
const {joinRoom} = require("../controllers/room/joinroom");
const { getMyRooms } = require("../controllers/room/getmyrooms");
const {getByRoomId} = require("../controllers/room/getbyroomid");
const {addMember}= require("../controllers/room/addmember");
const { removeMember } = require("../controllers/room/removemember");
const { updateRole } = require("../controllers/room/updaterole");
const { deleteRoom } = require("../controllers/room/deleteroom");
const { leaveRoom } = require("../controllers/room/leaveroom");
const { roomSettlementStatus } = require("../controllers/room/roomsettlementstatus");
const { updateRoomName } = require("../controllers/room/updateroomname");


router.post("/create", authentication, createRoom);
router.post("/join", authentication, joinRoom);
router.get("/my",authentication,getMyRooms);
router.get("/:roomId",authentication, getByRoomId);
router.post("/:roomId/addMember",authentication, addMember);
router.delete("/:roomId/removeMember/:memberDbId",authentication, removeMember);
router.patch("/:roomId/updateRole/:memberDbId", authentication, updateRole);
router.delete("/:roomId/deleteRoom",authentication, deleteRoom);
router.post("/:roomId/leaveRoom",authentication,leaveRoom);
router.get("/:roomId/roomSettlementStatus",authentication,roomSettlementStatus);
router.patch("/:roomId/updateRoomName",authentication,updateRoomName);

module.exports = router;
