const mongoose = require("mongoose");

const Products = mongoose.model("Products", {
  pname: String,
  pdesc: String,
  price: Number,
  pcategory: String,
  pimage: String,
  addedBy: mongoose.Schema.Types.ObjectId,
});

module.exports.search = (req, res) => {
  let search = req.query.search;

  Products.find({
    $or: [
      { pname: { $regex: search } },
      { pdesc: { $regex: search } },
      { pcategory: { $regex: search } },
    ],
  })
    .then((results) => {
      res.send({ message: "success", products: results });
    })
    .catch(() => {
      res.send({ message: "failed" });
    });
};

module.exports.addProduct = (req, res) => {
  const pname = req.body.pname;
  const pdesc = req.body.pdesc;
  const price = req.body.price;
  const pcategory = req.body.pcategory;
  const pimage = req.file.path;
  const addedBy = req.body.userId;

  const product = new Products({
    pname,
    pdesc,
    price,
    pcategory,
    pimage,
    addedBy,
  });
  product
    .save()
    .then(() => {
      res.send({ message: "saved successfully" });
    })
    .catch(() => {
      res.send({ message: "server error" });
    });
};

module.exports.editProduct = (req, res) => {
  console.log(req.body);
  console.log(req.file);

  const pname = req.body.pname;
  const pdesc = req.body.pdesc;
  const price = req.body.price;
  const pcategory = req.body.pcategory;
  const pimage = req.file.path;
  const addedBy = req.body.userId;
  const productId = req.body.productId;

  let editObj = {};

  if (pname) {
    editObj.pname = pname;
  }
  if (pdesc) {
    editObj.pdesc = pdesc;
  }
  if (price) {
    editObj.price = price;
  }
  if (pcategory) {
    editObj.pcategory = pcategory;
  }
  if (pimage) {
    editObj.pimage = pimage;
  }

  Products.updateOne({ _id: productId }, editObj, { new: true })
    .then((result) => {
      res.send({ message: "saved successfully" });
    })
    .catch(() => {
      res.send({ message: "server error" });
    });
};

module.exports.deleteProduct = (req, res) => {
  let productId = req.body.productId;
  let userId = req.body.userId;
  console.log(productId, userId);

  Products.findOne({ _id: productId })
    .then((result) => {
      if (result.addedBy == userId) {
        Products.deleteOne({ _id: productId }).then((deleteResult) => {
          if (deleteResult.acknowledged) {
            res.send({ message: "success" });
          }
          // res.send({ message: "Disliked successfully" });
        });
      }
    })
    .catch(() => {
      res.send({ message: "server error" });
    });
};

module.exports.getProducts = (req, res) => {
  const categoryName = req.query.categoryName;
  let _f = {};

  if (categoryName) {
    _f = { pcategory: categoryName };
  }

  Products.find(_f)
    .then((result) => {
      res.send({ message: "success", products: result });
    })
    .catch(() => {
      res.send({ message: "failed" });
    });
};

module.exports.getProductById = (req, res) => {
  Products.findOne({ _id: req.params.productId })
    .then((result) => {
      res.send({ message: "success", product: result });
    })
    .catch(() => {
      res.send({ message: "failed" });
    });
};

module.exports.myProducts = (req, res) => {
  Products.find({ addedBy: req.body.userId })
    .then((result) => {
      res.send({ message: "success", products: result });
    })
    .catch(() => {
      res.send({ message: "request failed" });
    });
};
