import { db } from "../connect.js";

// Function to create a new conversation
export const createConversation = (req, res) => {
  // const { senderId, receiverId } = req.body;
  const { senderId, receiverId } = req.query;

  const PsenderId = parseInt(senderId); // Convert firstUserId to integer
  const PreceiverId = parseInt(receiverId); // Convert secondUserId to integer

  // Function to check if conversation exists between two users
  const checkConversationExists = (callback) => {
    const q = "SELECT * FROM Conversations WHERE JSON_CONTAINS(members, JSON_ARRAY(?)) AND JSON_CONTAINS(members, JSON_ARRAY(?))";
    db.query(q, [PsenderId, PreceiverId], (err, result) => {
      if (err) return callback(err);
      if (result.length > 0) {
        return callback(null, true); // Conversation already exists
      } else {
        return callback(null, false); // Conversation doesn't exist
      }
    });
  };

  // Check if conversation exists
  checkConversationExists((err, conversationExists) => {
    if (err) return res.status(500).json(err);

    if (conversationExists) {
      // Conversation already exists, send a message
      return res.status(200).json({ message: "Conversation already exists" });
    } else {
      // Conversation doesn't exist, create a new one
      const members = JSON.stringify([PsenderId, PreceiverId]);
      const q = "INSERT INTO Conversations (members) VALUES (?)";
      db.query(q, [members], (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(200).json({ id: result.insertId });
      });
    }
  });
};





//og
// //Function to create a new conversation
// export const createConversation = (req, res) => {
//   const { senderId, receiverId } = req.body;

//   // Serialize the members array into JSON
//   const members = JSON.stringify([senderId, receiverId]);

//   const q = "INSERT INTO Conversations (members) VALUES (?)";

//   db.query(q, [members], (err, result) => {
//     if (err) return res.status(500).json(err);
//     res.status(200).json({ id: result.insertId });
//   });
// };





// Function to get conversations of a user
export const getUserConversations = (req, res) => {
  const userId = parseInt(req.params.userId); // Convert userId to integer

  const q = "SELECT * FROM Conversations WHERE JSON_CONTAINS(members, JSON_ARRAY(?))";

  db.query(q, [userId], (err, result) => {
    if (err) return res.status(500).json(err);

    res.status(200).json(result);
  });
};



// Function to get conversation including two userIds
export const getConversationBetweenUsers = (req, res) => {
  const { firstUserId, secondUserId } = req.params;

  const parsedFirstUserId = parseInt(firstUserId); // Convert firstUserId to integer
  const parsedSecondUserId = parseInt(secondUserId); // Convert secondUserId to integer

  const q = "SELECT * FROM Conversations WHERE JSON_CONTAINS(members, JSON_ARRAY(?)) AND JSON_CONTAINS(members, JSON_ARRAY(?))";

  db.query(q, [parsedFirstUserId, parsedSecondUserId], (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(result[0]);
  });
};

