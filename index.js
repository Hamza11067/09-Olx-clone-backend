const express = require("express");
const app = express();
const port = 3000;
const productController = require("./controllers/productController");
const userController = require("./controllers/userController");

const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const cors = require("cors");
app.use(cors());

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const jwt = require("jsonwebtoken");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});
const upload = multer({ storage: storage });

const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://hamzakhalid1067:0B7jlP3IIhyn3NRE@cluster0.j4l3sbi.mongodb.net/"
);



app.get("/", (req, res) => {
  res.send("Hello World! from Hamza Khalid.");
});

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.get("/search", productController.search);
app.post("/like-product", userController.likeProduct);
app.post("/dislike-product", userController.disLikeProduct);
app.post("/delete-product", productController.deleteProduct);
app.post("/liked-products", userController.likedProducts);
app.post("/my-products", productController.myProducts);
app.post("/signup", userController.signup);
app.post("/login", userController.login);
app.post("/add-product", upload.single("pimage"), productController.addProduct);
app.post("/edit-product", upload.single("pimage"), productController.editProduct);
app.get("/get-products", productController.getProducts);
app.get("/get-product/:productId", productController.getProductById);
app.get("/my-profile/:userId", userController.myProfileById);
app.get("/get-user/:addedBy", userController.getUser);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

module.exports = app;
