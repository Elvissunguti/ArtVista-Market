const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../Model/User");
const bcrypt = require("bcryptjs");
const { getToken, invalidateToken } = require("../Utils/Helpers");
const jwtUtils = require("../Utils/Helpers");


// Google OAuth login route
router.get(
  "/google",
  passport.authenticate("google", {scope: ["profile", "email"]}),
);

// Google OAuth callback route
router.get(
  "/google/callback",
  passport.authenticate("google", {failureRedirect: "/login"}),
  async (req, res) => {
    try {
      // Extract user information from Google authentication
      const {email, userName} = req.user;

      // Check if the user already exists in your database
      let user = await User.findOne({email});

      // If the user doesn't exist, create a new user without requiring a password
      if (!user) {
        user = new User({email, userName});
        await user.save();
      }

      const token = await getToken(email, user);

      

      res.redirect(`https://codecrafter-s-corner.web.app/Blog?token=${token}`); // Redirect to home page or send token in response
    } catch (error) {
      console.error("Error handling Google authentication:", error);
      res.status(500).json({error: "Error handling Google authentication"});
    }
  },
);


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


  router.get(
    "/userId",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
      try {
        const userId = req.user._id;  
  
        const user = await User.findById(userId);
  
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
  
        const { _id, userName } = user;
  
        console.log("logged in user", user);
  
        return res.json({ data: { _id, userName } });
      } catch (error) {
        console.error("Error fetching userId", error);
        return res.status(500).json({ error: "Error fetching userId" });
      }
    },
  );

module.exports = router;