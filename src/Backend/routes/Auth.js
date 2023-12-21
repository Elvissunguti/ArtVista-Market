const express = require("express");
const router = express.Router();
const User = require("../Model/User");
const bcrypt = require("bcrypt");
const { getToken, invalidateToken } = require("../Utils/Helpers");
const jwtUtils = require('../Utils/Helpers');


router.post("/signup", async (req, res) => {
    try{

        const { userName, email, password } = req.body;

        const existingUser = await User.findOne({ email })

        if(existingUser){
            return res.json({ message: "User with this email already exist"})
        };

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = new User({
            userName,
            email, 
            password: hashedPassword,
        });
        await user.save();

        const token = await getToken(email, user);

        return res.json({ message: "User created Successfully", token});

    } catch(error){
        console.error( "Error creating user", error);
        return res.json({ message :"Error creating a User" });
    }
});

router.post("/login", async (req , res) => {
    try{

        // check if email exist
        const user = await User.findOne({ email: req.body.email });

        // If email exists
        if(user){
            const passwordChecker = await bcrypt.compare(
                req.body.password,
                user.password
            )

            if (passwordChecker){
                // generate a jwt token for authentification
                const token = await getToken(user.email, user);
                return res.json({ message: "Login successfull", token})
            } else{
                return res.json({ message: "Password does not match"})
            }
        } else {
            return res.json({ message: "email not found"})
        }

    } catch (error){
        console.error("Error Logging in user", error)
        return res.json({ message: "Failed to login"})

    }
});


router.post("/logout", async (request, response) => {
    try {
      // Verify the token
      const token = request.headers.authorization;
  
      // Check if the token is invalid
      if (jwtUtils.isTokenInvalid(token)) {
        console.error("Invalid token:", token);
        return response.status(401).send({
          message: "Invalid token",
        });
      }
  
      // Verify the token
      const decodedToken = jwtUtils.verifyToken(token);
  
      if (!decodedToken) {
        console.error("Invalid token:", token);
        return response.status(401).send({
          message: "Invalid token",
        });
      }
  
      // Invalidate the token
      jwtUtils.invalidateToken(token);
  
      return response.status(200).json({
        message: "Logout successful",
      });
    } catch (error) {
      return response.status(500).send({
        message: "Internal Server Error",
        error,
      });
    }
  });

module.exports = router;