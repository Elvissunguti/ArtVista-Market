require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");
const MongoStore = require("connect-mongo");
const path = require("path");
const functions = require("firebase-functions");
const config = require("./Config/Config");
const User = require("./Model/User");
const AuthRoutes = require("./routes/Auth");
const ArtWorkRoutes = require("./routes/ArtWork");
const WishListRoutes = require("./routes/WishList");
const CartListRoutes = require("./routes/CartList");
const ArtistRoutes = require("./routes/Artist");
const ProfileRoutes = require("./routes/Profile");
const SearchRoutes = require("./routes/Search");
const FilterRoutes = require("./routes/Filter");
const MessageRoutes = require("./routes/Message");
const OrderRoutes = require("./routes/Order");
const AddressRoutes = require("./routes/Address");
const PaymentRoutes = require("./routes/Payment");
const admin = require("firebase-admin");


const app = express();

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: "https://artvista-market.firebaseio.com",
  });
}

const db = admin.firestore();


// Configure MongoDB connection
mongoose.connect(
  "mongodb://ArtVista:ArtVista@ac-u6swv3i-shard-00-00.vftu7sn.mongodb.net:27017,ac-u6swv3i-shard-00-01.vftu7sn.mongodb.net:27017,ac-u6swv3i-shard-00-02.vftu7sn.mongodb.net:27017/ArtVista?ssl=true&replicaSet=atlas-skhhdo-shard-0&authSource=admin&retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
).then(() => {
  console.log("Connected to MongoDB Atlas");
}).catch((err) => {
  console.log("Error connecting to MongoDB Atlas", err);
});

// Configure session and Passport
const sessionStore = MongoStore.create({
  mongoUrl: "mongodb://ArtVista:ArtVista@ac-u6swv3i-shard-00-00.vftu7sn.mongodb.net:27017,ac-u6swv3i-shard-00-01.vftu7sn.mongodb.net:27017,ac-u6swv3i-shard-00-02.vftu7sn.mongodb.net:27017/ArtVista?ssl=true&replicaSet=atlas-skhhdo-shard-0&authSource=admin&retryWrites=true&w=majority",
  collection: "sessions",
});


app.use(cors({
  origin: [
    "https://artvista-market.web.app",
    "https://artvista-market.firebaseapp.com",
    "http://127.0.0.1:7000",
  ],
  credentials: true,
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "SECRETKEY",
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
  })
);

// Setup passport-jwt
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "SECRETKEY";

passport.use(
  new JwtStrategy(opts, (async (jwt_payload, done) => {
    try {
      const user = await User.findOne({ _id: jwt_payload.identifier });
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  }))
);

// Configure Passport with Google OAuth 2.0
passport.use(new GoogleStrategy({
  clientID: config.google.clientID,
  clientSecret: config.google.clientSecret,
  callbackURL: "https://api-avfkvnhjaq-uc.a.run.app/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });

    if (user) {
      // User already exists, return user
      return done(null, user);
    } else {
      // Create new user
      const newUser = new User({
        googleId: profile.id,
        displayName: profile.displayName,
        chatHistory: []
      });
      await newUser.save();
      return done(null, newUser);
    }
  } catch (err) {
    return done(err);
  }
}
));

// Serialize and deserialize user for sessions
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

app.use("/message",  MessageRoutes);


db.collection("messages")
  .orderBy("timestamp")
  .onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        const newMessage = change.doc.data();
        // Here, you can broadcast this message to all connected clients
        // (Use Firebase functions to send notifications or Firestore listeners on the client side)
      }
    });
  });


// Your existing routes
app.use("/auth", AuthRoutes);
app.use("/artwork", ArtWorkRoutes);
app.use("/wishList", WishListRoutes);
app.use("/cartList", CartListRoutes);
app.use("/artist", ArtistRoutes);
app.use("/profile", ProfileRoutes);
app.use("/search", SearchRoutes);
app.use("/filter", FilterRoutes);
app.use("/order", OrderRoutes);
app.use("/address", AddressRoutes);
app.use("/api/payment", PaymentRoutes);


exports.api = functions.https.onRequest(app);