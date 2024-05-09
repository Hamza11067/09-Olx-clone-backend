const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const Users = mongoose.model("Users", {
  username: String,
  password: String,
  mobile: String,
  email: String,
  likedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Products" }],
});

module.exports.signup = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const mobile = req.body.mobile;
  const email = req.body.email;

  const user = new Users({
    username,
    password,
    mobile,
    email,
  });
  user
    .save()
    .then(() => {
      res.send({ message: "User saved successfully" });
    })
    .catch(() => {
      res.send({ message: "server error" });
    });
};

module.exports.login = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // finding user for login
  Users.findOne({ username: username })
    .then((result) => {
      if (!result) {
        res.send({ message: "User not found" });
      } else if (result.password == password) {
        const token = jwt.sign({ data: result }, "MY_SECRET_KEY", {
          expiresIn: "1hr",
        });
        res.send({
          message: "User found successfully",
          token: token,
          userId: result._id,
        });
      } else {
        res.send({ message: "Wrong password" });
      }
    })
    .catch(() => {
      res.send({ message: "server error" });
    });
};

module.exports.likeProduct = (req, res) => {
  let productId = req.body.productId;
  let userId = req.body.userId;

  Users.updateOne({ _id: userId }, { $addToSet: { likedProducts: productId } })
    .then(() => {
      res.send({ message: "liked successfully" });
    })
    .catch(() => {
      res.send({ message: "server error" });
    });
};

module.exports.disLikeProduct = (req, res) => {
  let productId = req.body.productId;
  let userId = req.body.userId;

  Users.updateOne({ _id: userId }, { $pull: { likedProducts: productId } })
    .then(() => {
      res.send({ message: "Disliked successfully" });
    })
    .catch(() => {
      res.send({ message: "server error" });
    });
};

module.exports.likedProducts = (req, res) => {
  Users.findOne({ _id: req.body.userId })
    .populate("likedProducts")
    .then((result) => {
      res.send({ message: "success", products: result.likedProducts });
    })
    .catch(() => {
      res.send({ message: "request failed" });
    });
};

module.exports.myProfileById = (req, res) => {
  const userId = req.params.userId;

  Users.findOne({ _id: userId })
    .then((result) => {
      res.send({
        message: "success",
        user: {
          username: result.username,
          mobile: result.mobile,
          email: result.email,
        },
      });
    })
    .catch(() => {
      res.send({ message: "server error" });
    });
};

module.exports.getUser = (req, res) => {
  const _userId = req.params.addedBy;

  Users.findOne({ _id: _userId })
    .then((result) => {
      res.send({
        message: "success",
        user: {
          username: result.username,
          mobile: result.mobile,
          email: result.email,
        },
      });
    })
    .catch(() => {
      res.send({ message: "server error" });
    });
};
