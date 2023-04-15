import Product from "../models/ProductModel.js";


export const createProduct = async (req, res, next) => {
  var { name, price } = req.body;
  try {
    const newProduct = new Product({
      name: name,
      price: price,
    });

    await newProduct.save();

    res.status(200).send("Product has been created!");
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  var {name, price} = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (!name) {
      name = product.name;
    }
    if (!price) {
      price = product.price;
    }
    
    const updateProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
       name:name,
       price:price
      },
      { new: true }
    );

    res.status(200).json(updateProduct);
  } catch (error) {
    next(err);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json("Product has been deleted!");
  } catch (error) {
    next(err);
  }
};
