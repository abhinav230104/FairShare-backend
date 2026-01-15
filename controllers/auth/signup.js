const bcrypt = require("bcryptjs");
const User = require("../../models/User");

// ID generator
const generateUserId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `nomad-${code}`;
};

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let user;
    while (true) {
      try {
        user = new User({
          userId: generateUserId(),
          name: name.trim(),
          email: normalizedEmail,
          password: hashedPassword,
        });

        await user.save();
        break;
      } catch (error) {
        if (error.code === 11000 && error.keyPattern?.userId) continue;
        throw error;
      }
    }

    res.status(201).json({
      message: "Signup successful",
      userId: user.userId,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { signup };
