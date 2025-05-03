const express = require("express");
const app = express();
require("dotenv").config();
const path = require('path');// temp change to force git detect
const connectDB = require("./config/db");
const cors = require("cors");
const userRouter = require("./routes/userRoutes");
const movieRouter = require("./routes/movieRoutes");
const theatreRouter = require("./routes/theatreRoutes");
const showRouter = require("./routes/showRoutes");
const bookRouter = require("./routes/bookingRoutes");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const appLimit = rateLimit({
  windowMs : 15*60*1000,
  max:100,
  message:"to many request from this IP, please try again after 15 minutes",
});

connectDB();
app.use(helmet());
app.use(mongoSanitize());

app.use(express.json());
app.use(cors());
app.use("/api",appLimit);
// app.use(cors({
//   origin: "http://localhost:3000", // Allow frontend origin
//   methods: ["GET", "POST", "OPTIONS"],
//   credentials: true,
// }));
// app.options("api/make-payment", cors()); // Handle preflight requests for this endpoint


app.use("/api/users", userRouter);
app.use("/api/movies", movieRouter);
app.use("/api/theatres",theatreRouter);
app.use("/api/shows",showRouter);
app.use("/api/bookings",bookRouter);

//  Serve React build folder (IMPORTANT)use if deploying from=nt and back end togethr
// app.use(express.static(path.join(__dirname, "../client/build")));

// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
// });
const PORT = process.env.PORT || 8082
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

