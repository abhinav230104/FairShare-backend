const isMember = (room, user_id) => {
  return room.members.find(
    m => m.user.toString() === user_id.toString()
  );
};

const isAdmin = (room, user_id) => {
  const member = isMember(room, user_id);
  return member && member.role === "admin";
};

module.exports = { isMember, isAdmin };
