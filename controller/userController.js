import { User } from '../model/user.js';
import jwt from 'jsonwebtoken';
import sendMail from '../middleware/sendMail.js';

const JWT_SECRET = process.env.SECRET;

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

export const loginUser = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({ email });
    }

    const otp = generateOtp();

    const verifyToken = jwt.sign(
      { userId: user._id, otp },
      JWT_SECRET,
      { expiresIn: '10m' }
    );

    await sendMail(email, "Your OTP for FlavorExpress", otp);

    res.status(200).json({
      message: "Verification email sent",
      verifyToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


export const verifyUser = async (req, res) => {
  try {
    const { verifyToken, otp } = req.body;

    if (!verifyToken || !otp) {
      return res.status(400).json({ message: "verifyToken and otp are required" });
    }

    let decoded;
    try {
      decoded = jwt.verify(verifyToken, JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(400).json({ message: "OTP expired. Please request a new one." });
      }
      return res.status(400).json({ message: "Invalid OTP token" });
    }

    if (decoded.otp !== otp.toString()) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = jwt.sign(
      { _id: user._id },
      JWT_SECRET,
      { expiresIn: '5d' }
    );

    res.json({
      message: 'Logged in successfully',
      token,
      user,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


export const userProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).lean();
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
