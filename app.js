const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();
const fs = require("fs");
const path = require("path");

// const helmet = require("helmet");
// const compression = require("compression");
// const morgan = require("morgan");

const userRoute = require("./routes/userRoute");
const expRoute = require("./routes/expenseRoute");
const purchaseRoute = require("./routes/purchaseRoute");
const passwordRoute = require("./routes/passwordRoute");
const reportRoute = require("./routes/reportRoute");
const User = require("./models/user");
// const Expense = require("./models/expenseModel");
// const Orders = require("./models/orders");
// const forgotPasswordReq = require("./models/forgotPassword");
// const fileDownloads = require("./models/fileDownloads");

app.use(express.urlencoded({ extended: true }));

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

// app.use(helmet());
// app.use(morgan("combined", { stream: accessLogStream }));

// app.use(compression());

app.use(express.json());
app.use(cors({}));
app.use(express.static("public"));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((err) => {
    console.log("error in connecting to mongo db", err);
  });

app.post("/signup", userRoute);

app.post("/login", userRoute);

app.post("/addExpense", expRoute);

app.delete("/deleteExpense/:id", expRoute);

app.get("/displayItems", expRoute);
app.get("/leaderBoard", expRoute);

app.post("/buyPremium", purchaseRoute);

app.post("/updateTransactionStatus", purchaseRoute);

app.get("/checkPremium", purchaseRoute);

app.post("/forgotPassword", passwordRoute);

app.get("/resetPassword/:requestId", passwordRoute);

app.post("/updatePassword/:requestId", passwordRoute);
app.get("/displayEItems", reportRoute);

app.get("/download", reportRoute);

app.post("/savelink", reportRoute);

app.get("/reportData", reportRoute);

app.use((req, res) => {
  res.sendFile(path.join(__dirname, `public/${req.url}`));
});

// User.hasMany(Expense);
// Expense.belongsTo(User);

// User.hasMany(Orders);
// Orders.belongsTo(User);

// User.hasMany(forgotPasswordReq);
// User.hasMany(fileDownloads);

app.listen(3000);
