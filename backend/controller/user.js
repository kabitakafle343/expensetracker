const User = require("../schema/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      return res.status(401).json({ message: "invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email,name:user.name },
      process.env.JWT_SCRETEKEY,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.UserSignUp = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: "email, password and name are required" });
    }

    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      return res.status(400).json({ message: "user already exist" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hashPassword, name });

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

