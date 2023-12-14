const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const session = require("express-session");
const MongoStore = require("connect-mongo");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");
const createWebSocketServer = require("./src/Backend/routes/WebSocketServer");
const User = require("./src/Backend/Model/User");
const AuthRoutes = require("./src/Backend/routes/Auth");
const ArtWorkRoutes = require("./src/Backend/routes/ArtWork");
const WishListRoutes = require("./src/Backend/routes/WishList");
const CartListRoutes = require("./src/Backend/routes/CartList");
const ArtistRoutes = require("./src/Backend/routes/Artist");
const ProfileRoutes = require("./src/Backend/routes/Profile");
const SearchRoutes = require("./src/Backend/routes/Search");
const FilterRoutes = require("./src/Backend/routes/Filter");
const MessageRoutes = require("./src/Backend/routes/Message");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 8080;

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
  mongoUrl: 'mongodb://ArtVista:ArtVista@ac-u6swv3i-shard-00-00.vftu7sn.mongodb.net:27017,ac-u6swv3i-shard-00-01.vftu7sn.mongodb.net:27017,ac-u6swv3i-shard-00-02.vftu7sn.mongodb.net:27017/ArtVista?ssl=true&replicaSet=atlas-skhhdo-shard-0&authSource=admin&retryWrites=true&w=majority',
  collection: 'sessions',
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: 'SECRETKEY',
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
  new JwtStrategy(opts, async function (jwt_payload, done) {
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
  })
);

// Serialize and deserialize user for sessions
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// WebSocket connection handling with Passport authentication
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Creating WebSocket server and passing io and sessionStore
createWebSocketServer(io, sessionStore);

// Connection event moved inside the createWebSocketServer function

// Your existing routes
app.use("/auth", AuthRoutes);
app.use("/artwork", ArtWorkRoutes);
app.use("/wishList", WishListRoutes);
app.use("/cartList", CartListRoutes);
app.use("/artist", ArtistRoutes);
app.use("/profile", ProfileRoutes);
app.use("/search", SearchRoutes);
app.use("/filter", FilterRoutes);
app.use("/message", MessageRoutes);

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
