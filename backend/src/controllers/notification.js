import db from "../database/db.js";
import { sendEmail } from "../model/emailService.js";

export const sendMail = async (req, res) => {
  const currentDate = new Date();
  const email = req.body.email;
  const thresholdLevel = req.body.threshhold;
  const noiseLevel = req.body.noiseValue;
  
  console.log(req.body);

  if (!email || !thresholdLevel || !noiseLevel) {
    return res.status(400).json({ Error: "Missing required data" });
  }

  const subject = "Noise Alert Notification";
  const message = `Hello,

We would like to inform you that high noise levels have been detected.

Details:
- Noise Level: ${noiseLevel} dB
- Threshold: ${thresholdLevel} dB
- Date and Time: ${currentDate.toLocaleString()}

Please address this alert promptly to ensure a quiet environment.

Note: This is an automated alert. If you have any questions, please contact us.

Thank you,
Noise Detection System`;

  // Format date and time as strings
  const date = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD
  const time = currentDate.toTimeString().split(' ')[0]; // HH:MM:SS
  
  const values = [email, noiseLevel, thresholdLevel, date, time];
  const sql =
    "INSERT INTO `nds_project7`.`notification` (`email`, `noiseLevel`, `threshold`, `date`, `time`) VALUES (?, ?, ?, ?, ?)";

  try {
    // Insert data into the database
    db.query(sql, values, async (err, data) => {
      if (err) {
        console.error("Database error: ", err);  // Log the error
        return res.status(500).json({ Error: "Error inserting data in server side" });
      }

      // If data inserted successfully, send the email
      try {
        await sendEmail(email, subject, message);
        return res.status(200).json({ message: "Email sent and data saved successfully", status: "Success", email });
      } catch (emailError) {
        // console.error("Email sending error: ", emailError);  // Log the email semd error
        return res.status(500).json({ Error: "Error sending email" });
      }
    });
  } catch (error) {
    // console.error("Request processing error: ", error);  // Log the request error
    return res.status(500).json({ Error: "Error in processing request" });
  }
};


// import db from "../database/db.js";
// import { sendEmail } from "../model/emailService.js";
// export const sendMail = async (req, res) => {
//   const dateTime = new Date().toLocaleString();
//   const email = req.body.email;
//   const thresholdLevel = req.body.threshhold;
//   const noiseLevel = req.body.noiseValue;
//   console.log(req.body);
//   const subject = "Noise Alert Notification";
//   const message = `Hello,

// We would like to inform you that high noise levels have been detected.

// Details:
// - Noise Level: ${noiseLevel} dB
// - Threshold: ${thresholdLevel} dB
// - Date and Time: ${dateTime}

// Please address this alert promptly to ensure a quiet environment.

// Note: This is an automated alert. If you have any questions, please contact us.

// Thank you,
// Noise Detection Systen`;
//   const values = [email, noiseLevel, thresholdLevel, dateTime];
//   const sql =
//     "INSERT INTO `nds_project7`.`notification` (`email`, `noiseLevel`, `threshold`, `date`) VALUES (values)";

//   try {
//     db.query(sql, [values], (err, data) => {
//       if (err)
//         return res.json({ Error: "Inserting datad error in server side" });
//     });
//     await sendEmail(email, subject, message);

//     return res
//       .status(200)
//       .json({ message: "Email sent successfully", status: "Success", email });
//   } catch (error) {
//     return res.status(500).json({ error: "Error sending email" });
//   }
// };
// import db from "../database/db.js";
// import { sendEmail } from "../model/emailService.js";

// export const sendMail = async (req, res) => {
//   const currentDate = new Date();
//   const email = req.body.email;
//   const thresholdLevel = req.body.threshhold;
//   const noiseLevel = req.body.noiseValue;
  
//   console.log(req.body);

//   const subject = "Noise Alert Notification";
//   const message = `Hello,

// We would like to inform you that high noise levels have been detected.

// Details:
// - Noise Level: ${noiseLevel} dB
// - Threshold: ${thresholdLevel} dB
// - Date and Time: ${currentDate.toLocaleString()}

// Please address this alert promptly to ensure a quiet environment.

// Note: This is an automated alert. If you have any questions, please contact us.

// Thank you,
// Noise Detection System`;

//   const date = currentDate.toLocaleDateString(); // Format the date
//   const time = currentDate.toLocaleTimeString(); // Format the time
//   const values = [email, noiseLevel, thresholdLevel, date, time];
//   const sql =
//     "INSERT INTO `nds_project7`.`notification` (`email`, `noiseLevel`, `threshold`, `date`, `time`) VALUES (?, ?, ?, ?, ?)";

//   try {
//     // Insert data into the database
//     db.query(sql, values, async (err, data) => {
//       if (err) {
//         return res.status(500).json({ Error: "Error inserting data in server side" });
//       }

//       // If data inserted successfully, send the email
//       try {
//         await sendEmail(email, subject, message);
//         return res.status(200).json({ message: "Email sent and data saved successfully", status: "Success", email });
//       } catch (emailError) {
//         return res.status(500).json({ Error: "Error sending email" });
//       }
//     });
//   } catch (error) {
//     return res.status(500).json({ Error: "Error in processing request" });
//   }
// };
