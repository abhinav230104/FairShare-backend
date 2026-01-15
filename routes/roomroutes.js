const express = require("express");
const router = express.Router();

const authentication = require("../middlewares/authmiddleware");
const {createRoom} = require("../controllers/room/createroom");
const {joinRoom} = require("../controllers/room/joinroom");
const { getMyRooms } = require("../controllers/room/getmyrooms");
const {getByRoomId} = require("../controllers/room/getbyroomid");
router.post("/create", authentication, createRoom);
router.post("/join", authentication, joinRoom);
router.get("/my",authentication,getMyRooms);
router.get("/:roomId",authentication, getByRoomId);

module.exports = router;
