const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy,
    ExtractJwt = require("passport-jwt").ExtractJwt;
const path = require("path");
const User = require("./src/Backend/Model/User");
const AuthRoutes = require("./src/Backend/routes/Auth");
const ArtWorkRoutes = require("./src/Backend/routes/ArtWork");


const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); 
app.use(express.urlencoded({ extended: true}));


mongoose.connect(
    'mongodb://ArtVista:ArtVista@ac-u6swv3i-shard-00-00.vftu7sn.mongodb.net:27017,ac-u6swv3i-shard-00-01.vftu7sn.mongodb.net:27017,ac-u6swv3i-shard-00-02.vftu7sn.mongodb.net:27017/ArtVista?ssl=true&replicaSet=atlas-skhhdo-shard-0&authSource=admin&retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true}
).then(() => {
    console.log("Connected to mongodb Atlas")
}).catch((err) => {
    console.log("Error connecting to mongodb Atlas", err)
});

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
  });


        // setup passport-jwt
        const opts = {};
        opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
        opts.secretOrKey = "SECRETKEY"; // Use environment variable for the secret key
        
        passport.use(
          new JwtStrategy(opts, async function (jwt_payload, done) {
            try {
              const user = await User.findOne({ _id: jwt_payload.identifier });
              if (user) {
                return done(null, user); // Authentication successful
              } else {
                return done(null, false); // User not found
                // Alternatively, you could create a new account here
              }
            } catch (err) {
              return done(err, false); // Error during user lookup
            }
          })
        );


app.use("/auth", AuthRoutes);
app.use("/artwork", ArtWorkRoutes);

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
});