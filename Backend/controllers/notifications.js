import { db } from "../connect.js";
import jwt from "jsonwebtoken";

// Insert notification into the database
// export const insertNotification = (receiverId, postId, type) => {
//     const token = req.cookies.accessToken;
//     if (!token) throw new Error("Not logged in!");

//     const userInfo = jwt.verify(token, "secretkey");
//     const senderId = userInfo.id;

//     const q = "INSERT INTO notifications (senderId, receiverId, postId, type) VALUES (?, ?, ?, ?)";
//     const values = [senderId, receiverId, postId, type];

//     db.query(q, values, (err, data) => {
//         if (err) {
//             console.error("Error inserting notification:", err);
//             throw err;
//         } else {
//             console.log("Notification inserted successfully.");
//         }
//     });
// };


export const insertNotification = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");
  
    jwt.verify(token, "secretkey", (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid!");
  
      const q = "INSERT INTO notifications (senderId, receiverId, postId, type) VALUES (?, ?, ?, ?)";
    //   const values = [senderId, receiverId, postId, type];

      const values = [
        userInfo.id,
        req.body.receiverId,
        req.body.postId,
        req.body.type
      ];
  
      db.query(q, values, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Notification inserted successfully.");
      });
    });
  };




// API to fetch notifications for a user
export const getNotifications = (req, res) => {


        // const q = "SELECT * FROM notifications WHERE receiverId = ?";
        const q = "SELECT u.*, n.* FROM users u INNER JOIN notifications n ON u.id = n.senderId WHERE n.receiverId = ? ORDER BY n.time DESC";
        
        
       // "SELECT u.*, aj.applied_at FROM users u INNER JOIN appliedjobs aj ON u.id = aj.userid WHERE aj.postid = ?"
        db.query(q, [req.query.userId], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(data);
        });
    

};

export const deleteNotification = (req, res) => {
    const notificationId = req.query.id; // Assuming the ID is passed in the query string
  
    const q = "DELETE FROM notifications WHERE Nid = ?";
    db.query(q, [notificationId], (err, data) => {
      if (err) {
        console.error("Error deleting notification:", err);
        return res.status(500).json({ error: "Error deleting notification" });
      } else {
        return res.status(200).json({ message: "Notification deleted successfully" });
      }
    });
  };
  
