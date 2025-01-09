import db from '../database/db.js';

export const getData = (req, res) => {
  const email = req.body.email;

  // Check if email is provided
  if (!email) {
    return res.status(400).json({
      status: "Failed",
      error: "Email is required",
    });
  }

  const query = "SELECT * FROM nds_project7.user WHERE email = ?";
  db.query(query, [email], (err, response) => {
    if (err) {
      return res.status(500).json({
        status: "Failed",
        error: "Database error",
        details: err.message,
      });
    }

    if (response.length > 0) {
      const userData = {
        name: response[0].name,
        phone: response[0].phone,
        dob: response[0].dob,
        email: response[0].email,
      };

      return res.status(200).json({
        status: "Success",
        data: userData,
      });
    } else {
      return res.status(404).json({
        status: "Failed",
        error: "User not found",
      });
    }
  });
};

// export const notificationData = (req,res)=>{
//   const email = req.body.email;

//   // Check if email is provided
//   if (!email) {
//     return res.status(400).json({
//       status: "Failed",
//       error: "Email is required",
//     });
//   }

//   const query = "SELECT * FROM nds_project7.notification WHERE email = ?";
//   db.query(query, [email], (err, response) => {
//     if (err) {
//       return res.status(500).json({
//         status: "Failed",
//         error: "Database error",
//         details: err.message,
//       });
//     }

//     if (response.length > 0) {
//       const userData = {
//         id:response[0].notificationid,
//         email:response[0].email,
//         noiseLevel: response[0].noiseLevel,
//         threshold: response[0].threshold,
//         date: response[0].date,
//         time: response[0].time,
//       };

//       return res.status(200).json({
//         status: "Success",
//         data: response,
//       });
//     } else {
//       return res.status(404).json({
//         status: "Failed",
//         error: "User not found",
//       });
//     }
//   });
// }

export const notificationData = (req, res) => {
  const email = req.body.email;

  // Check if email is provided
  if (!email) {
    return res.status(400).json({
      status: "Failed",
      error: "Email is required",
    });
  }

  const query = "SELECT * FROM nds_project7.notification WHERE email = ?";
  db.query(query, [email], (err, response) => {
    if (err) {
      return res.status(500).json({
        status: "Failed",
        error: "Database error",
        details: err.message,
      });
    }

    if (response.length > 0) {
      // Send the entire list of notifications
      const notifications = response.map((item) => ({
        id: item.notificationid,
        email: item.email,
        noiseLevel: item.noiseLevel,
        threshold: item.threshold,
        date: item.date,
        time: item.time,
      }));

      return res.status(200).json({
        status: "Success",
        data: notifications, // Properly formatted list of notifications
      });
    } else {
      return res.status(404).json({
        status: "Failed",
        error: "No notifications found for the given email",
      });
    }
  });
};
