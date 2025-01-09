import db from '../database/db.js';

import bcrypt from 'bcrypt';




import { sendEmail } from '../model/emailService.js';

export const forgotPassword = async (req, res) => {
    const email = req.body.email;
    const otp = Math.floor(100000 + Math.random() * 900000);
    
    const updateOtpQuery = 'UPDATE nds_project7.user SET otpe = ? WHERE email = ?';
    db.query(updateOtpQuery, [otp, email], (err, response) => {
        if (err) {
          
            return res.status(500).json({ error: "Error in Server" });
        }
        console.log("OTP updated successfully!");
    });

    const selectUserQuery = 'SELECT * FROM nds_project7.user WHERE email = ?';
    db.query(selectUserQuery, [email], async (err, data) => {
        if (err) {
           
            return res.status(500).json({ error: "Error in Server" });
        }

        if (data.length > 0) {
            const subject = 'Your OTP Verification Code';
            const message = `Hello,

We have received a request for OTP verification. Please use the following One-Time Password (OTP) to complete your verification process:

OTP Code: ${otp}

Note: This OTP is valid for the next 10 minutes. Please do not share it with anyone. If you did not request this verification, please ignore this email.

Thank you,
Noise Detection Systen`;

            try {
                await sendEmail(email, subject, message);
                return res.status(200).json({ message: "Email sent successfully", status: "Success", email });
            } catch (error) {
                return res.status(500).json({ error: "Error sending email" });
            }
        } else {
            return res.status(404).json({ error: "User not found" });
        }
    });
};



export const verifyEmail = async (req, res) => {
    const { otp, email } = req.body;
    console.log("Received OTP:", otp, "Email:", email);

    const sql = "SELECT * FROM nds_project7.user WHERE email = ?";
    db.query(sql, [email], (err, data) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Error in Server" });
        }

        if (data.length > 0) {
            const storedOtp = data[0].otpe.toString(); // Ensure OTP from DB is a string
            if (otp === storedOtp) {
                return res.status(200).json({ 
                    message: "Email OTP Verified", 
                    status: "Success", 
                    email 
                });
            } else {
                return res.status(400).json({ error: "Incorrect OTP" });
            }
        } else {
            return res.status(404).json({ error: "No user with this email exists" });
        }
    });
};

export const newPassword = async (req, res) => {
    const email = req.body.email;
    console.log(email);

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);

    const sql = "SELECT * FROM nds_project7.user WHERE email = ?";

    db.query(sql, [email], (err, data) => {
        if (err) return res.json({ Error: "Error in Server" });

        if (data.length > 0) {
            // Compare new password with old password
            bcrypt.compare(req.body.password.toString(), data[0].password, async (err, response) => {
                if (err) return res.json({ Error: "Password compare error in Server" });

                if (response) {
                    // New password is the same as the old password
                    return res.status(400).json({
                        status: "Failed",
                        message: "New password cannot be the same as the old password",
                    });
                } else {
                    // Ensure passwords match
                    if (req.body.password === req.body.repassword) {
                        const sqlupdate = 'UPDATE nds_project7.user SET password = ? WHERE email=?;';
                        db.query(sqlupdate, [password, req.body.email], (err, data) => {
                            if (err) {
                                console.error(err);
                                return res.status(500).json({ error: "Error in Server" });
                            } else {
                                console.log("Password Updated!!");
                                return res.status(200).json({
                                    status: "Success",
                                    message: "Password updated successfully",
                                });
                            }
                        });
                    } else {
                        return res.status(400).json({ error: "Passwords do not match" });
                    }
                }
            });
        } else {
            return res.status(404).json({ error: "User not found" });
        }
    });
};


export const changePassword = async (req, res) => {
    const email = req.body.email;
    console.log(email);

    // Check if user exists in the database
    const sql = "SELECT * FROM nds_project7.user WHERE email = ?";
    db.query(sql, [email], (err, data) => {
        if (err) return res.status(500).json({ error: "Error in Server" });
        if (data.length > 0) {
            // Compare the current password with the stored password
            bcrypt.compare(req.body.currentPassword.toString(), data[0].password, async (err, response) => {
                if (err) return res.status(500).json({ error: "Password compare error in Server" });
                if (!response) {
                    return res.status(400).json({ status: "Failed", message: "Current password is incorrect" });
                } else {
                    // Check if new password and confirm password match
                    if (req.body.newPassword === req.body.confirmPassword) {
                        const salt = await bcrypt.genSalt(10);
                        const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);

                        // Update the password in the database
                        const sqlUpdate = 'UPDATE nds_project7.user SET password = ? WHERE email = ?';
                        db.query(sqlUpdate, [hashedPassword, email], (err, data) => {
                            if (err) {
                                console.error(err);
                                return res.status(500).json({ error: "Error updating password in Server" });
                            } else {
                                console.log("Password Updated!!");
                                return res.status(200).json({ status: "Success", message: "Password updated successfully" });
                            }
                        });
                    } else {
                        return res.status(401).json({ error: "New passwords do not match" });
                    }
                }
            });
        } else {
            return res.status(404).json({ error: "User not found" });
        }
    });
};



















// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: 'esmshelpline@gmail.com',
//         pass: 'twri tgyn qlej qpyc'
//     }
// });