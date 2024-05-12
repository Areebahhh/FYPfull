import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import { format } from 'date-fns';

//fetching posts
export const getPosts = (req, res) => {
   const userId = req.query.Puserid;
   const token = req.cookies.accessToken;
   if (!token) return res.status(401).json("Not logged in!");

   jwt.verify(token, "secretkey", (err, userInfo) => {
     if (err) return res.status(403).json("Token is not valid!");
   
   //query for only showing post on you wall from your friends and yours
    
    //this query is to display post on users profile that are only posted by him
     const q = userId !== "undefined" 
     ? `SELECT p.*, u.id AS userId, name, profilePic 
        FROM posts AS p 
        JOIN users AS u ON (u.id = p.Puserid) 
        WHERE p.Puserid=?
        ORDER BY p.createdAt DESC` 
     
     
     :  `SELECT p.*, u.id AS userId, u.name, u.profilePic
     FROM posts AS p
     JOIN users AS u ON (u.id = p.Puserid)
     WHERE p.Puserid = ? 
        OR p.Puserid IN (SELECT followeduserid FROM relationships WHERE followeruserid = ?)  
     ORDER BY p.createdAt DESC;
     `
    //  :  `SELECT p.*, u.id AS userId, name, profilePic 
    //     FROM posts AS p 
    //     JOIN users AS u ON (u.id = p.Puserid) 
    //     LEFT JOIN relationships AS r ON (p.Puserid = r.followeduserid) 
    //     WHERE r.followeruserid= ? OR p.Puserid =?
    //     ORDER BY p.createdAt DESC`

      const values= userId!== "undefined"  ? [userId]: [userInfo.id,userInfo.id]; 

     db.query(q, values, (err, data) => {
         if (err) return res.status(500).json(err);
         return res.status(200).json(data);
       });
   
   
    })
  
};



//for fetching job posts from recruiters
export const getJobPosts = (req, res) => {
  const userId = req.query.Puserid;
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
  
    // Query to fetch only job posts
    const q = userId !== "undefined" 
      ? `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u 
         ON (u.id = p.Puserid) 
         WHERE p.Puserid=? AND p.isJob = 1
         ORDER BY p.createdAt DESC` 
      : `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u 
        ON (u.id = p.Puserid) 
         LEFT JOIN relationships AS r ON (p.Puserid = r.followeduserid) 
         WHERE (r.followeruserid= ? OR p.Puserid =?) AND p.isJob = 1
         ORDER BY p.createdAt DESC`;

     // Values for the query
     const values= userId !== "undefined"  ? [userId]: [userInfo.id, userInfo.id]; 

     // Execute the query
     db.query(q, values, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
      });
  });
};



// fetch job posts for which the user has applied
export const getAppliedJobPosts = (req, res) => {
  const userId = req.query.Puserid;
  const token = req.cookies.accessToken;
  
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    // Query to fetch job posts for which the user has applied
    const q = `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u 
              ON (u.id = p.Puserid)  
              JOIN appliedjobs AS aj ON p.Pid = aj.postid 
              WHERE aj.userid = ?
              ORDER BY p.createdAt DESC;`;


              // SELECT p.Pid, p.Postdesc, p.img, p.Puserid, p.createdAt FROM posts AS p 
              // JOIN appliedjobs AS aj ON p.Pid = aj.postid 
              // WHERE aj.userid = 2;

    // Execute the query
    db.query(q, [userId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};










//for adding post from students
export const addPost = (req, res) => {

  const currentDate = new Date();
  const formattedDate = format(currentDate, 'yyyy-MM-dd HH:mm:ss');
  // const formattedDate = format(currentDate, 'YYYY-MM-DD HH:mm:ss');



  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
  
  //query for inserting post
   
    // const q = "INSERT INTO `posts` (`Postdesc`,`img`,`Puserid`,`createdAt`) VALUES=(?)";
    const q = "INSERT INTO `posts` (`Postdesc`, `img`, `Puserid`, `createdAt`) VALUES (?, ?, ?, ?)";
    

    const values = [
      req.body.Postdesc,
      req.body.img,
      userInfo.id,
      formattedDate
    ];

    db.query(q, values, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Post has been created.");
      });
  
  
   })



};

//for adding post from recruiters
export const addRecruiterPost = (req, res) => {
  const currentDate = new Date();
  const formattedDate = format(currentDate, 'yyyy-MM-dd HH:mm:ss');

  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const { Postdesc, img, isJob } = req.body;

    const q = "INSERT INTO `posts` (`Postdesc`, `img`, `Puserid`, `isJob`, `createdAt`) VALUES (?, ?, ?, ?, ?)";
    
    const values = [
      Postdesc,
      img,
      userInfo.id,
      isJob, // Use the value sent from the client
      formattedDate
    ];

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post has been created.");
    });
  });
};



export const deletePost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "DELETE FROM posts WHERE `Pid`=? AND `Puserid` = ?";

    db.query(q, [req.params.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if(data.affectedRows>0) return res.status(200).json("Post has been deleted.");
      return res.status(403).json("You can delete only your post")
    });
  });
};
