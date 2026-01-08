const express = require('express');
const router = express.Router();
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');
const OTPDB = require('.././models/otp');
const connectDB = require('.././config/connectDB');

connectDB();

function generateOTP() {
    return Math.floor(10000 + Math.random() * 90000).toString();
}

function otpEmailTemplate(otp) {
    return `
    <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:20px;">
        <div style="max-width:500px; margin:auto; background:#ffffff; padding:20px; border-radius:6px;">
        <h2 style="color:#333;">Email Verification</h2>
        <p style="font-size:14px; color:#555;">
            Use the OTP below to verify your email address:
        </p>

        <div style="
            font-size:32px;
            font-weight:bold;
            letter-spacing:6px;
            color:#2c3e50;
            text-align:center;
            margin:20px 0;
        ">
            ${otp}
        </div>

        <p style="font-size:13px; color:#777;">
            This OTP is valid for <b>5 minutes</b>.
        </p>

        <hr />

        <p style="font-size:12px; color:#999;">
            © ${new Date().getFullYear()} VeloX
        </p>
        </div>
    </div>
    `;
}

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    }
});

router.post("/", async (req, res) => {
    const { email } = req.body;
    const otp = generateOTP();
    const hashedOTP = await bcrypt.hash(String(otp), 10);
    
    try {
        await OTPDB.deleteMany({ email });
        
        await OTPDB.create({
            email,
            otp: hashedOTP,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 min
        });
        
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: "VeloX: Your OTP Code",
            html: otpEmailTemplate(otp)
        });
        
        res.status(200).json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/verify', async(req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP required" });
    }

    try {
        const otpRecord = await OTPDB.findOne({ email });

        if (!otpRecord) {
            return res.status(400).json({ message: "OTP not found" });
        }

        if (otpRecord.expiresAt < new Date()) {
            return res.status(400).json({ message: "OTP expired" });
        }

        const isValid = await bcrypt.compare(String(otp), otpRecord.otp);

        if (!isValid) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        await OTPDB.deleteOne({ email });

        return res.json({
            success: true,
            message: "OTP verified successfully"
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
});

router.get("/", (req, res) => {
    res.send("This is actual route");
});

module.exports = router;