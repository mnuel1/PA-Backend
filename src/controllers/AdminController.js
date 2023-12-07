const expressAsyncHandler = require('express-async-handler');
const connection = require('../configs/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { validateUserData } = require('../middlewares/ValidateUserData');

require('dotenv').config();

// Set up multer storage
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

const Register = expressAsyncHandler(async (req, res) => {

    const { username, email, contact, password, fullname, employment_id, office } = req.body;
    
    validateUserData(req, res, async () => {
        try {            
            connection.query(
                `INSERT INTO pa_admin (username, email, password, fullname,
                employment_id, office, contact, image, verify) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [username, email, password, fullname, employment_id, office, contact],
        (err, result) => {
          if (err) {
            console.error("Error inserting user:", err);
            res
              .status(500)
              .json({
                title: "Internal Error",
                message: "Registration failed. Please try again later.",
              });
          } else {
            res
              .status(200)
              .json({ title: "Success", message: "Registered Successfully" });
          }
        }
      );
    } catch (error) {
      console.error("Error hashing password:", error);
      res
        .status(500)
        .json({
          title: "Internal Error",
          message: "Registration failed. Please try again later.",
        });
    }
  });
});

const AdminLogin = expressAsyncHandler(async (req, res) => {
    const { username, password, checked } = req.body;
    connection.query('SELECT * FROM pa_admin WHERE username = $1 AND password = $2', [username, password], (err, result) => {
        if(err){
            res.status(500).json({title: 'Internal Error', message: err.message});
        }
        if(result.rows.length > 0){
            const { id, fullname, contact, email } = result.rows[0]; //eto
            const token = jwt.sign(
                {username: username, user_id: id, fullname: fullname, role: 'admin', contact, email}, //eto
                process.env.JWT_TOKEN,
                {expiresIn: checked ? '1d': '7d'}
            )                        
            res.status(200).json({title: "Success", message: "Login Successful", token: token, username: username, user_id: id, 
            fullname: fullname, role: 'admin', contact, email});
            
        
        }else{
            res.status(401).json({title: "Login Error" ,message: "Credentials Incorrect"})
        }
    })
})


const editAdmin = expressAsyncHandler(async (req, res) => {
  // Use 'upload.single' middleware to handle the file upload
  upload.single("image")(req, res, async (err) => {
    if (err) {
      return res
        .status(500)
        .json({ title: "Internal Error", message: "Image upload failed." });
    } else {
      console.log(req.body);
    }

    const { user_id, username, email, contact, image } = req.body;
    const imagePath = image.uri ? image.uri : null;

    console.log(imagePath);

    validateUserData(req, res, async () => {
      try {
        connection.query(
          `UPDATE pa_admin 
                SET username = $1, email = $2, contact = $3, image = $4 
                WHERE id = $5`,
          [username, email, contact, imagePath, user_id],
          (err, result) => {
            if (err) {
              console.error("Error updating user:", err);
              res
                .status(500)
                .json({
                  title: "Something went wrong.",
                  message: "Update failed. Please try again later.",
                });
            } else {
              res
                .status(200)
                .json({ title: "Success", message: "Updated Successfully" });
            }
          }
        );
      } catch (error) {
        res
          .status(500)
          .json({
            title: "Something went wrong.",
            message: "Update failed. Please try again later.",
          });
      }
    });
  });
});

const retrieveAdmin = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;

    connection.query('SELECT * FROM pa_admin WHERE id = $1', [id], (err, result) => {
    
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Something went wrong' });
        }        
        const { id, fullname, contact, email } = result.rows[0]; 
        res.status(200).json({title: "Success", message: "done", user_id: id, 
          fullname: fullname, role: 'admin', contact, email});
    })

})
module.exports = { Register, AdminLogin, editAdmin, retrieveAdmin};