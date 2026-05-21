import * as ProductsService from "../services/products.js";

export const getProductsHandler = async (req, res, next) => {
  try {
    const response = await ProductsService.getProducts(req);

    res.status(200).json({
      status: "success",
      data: response,
    });
  } catch (err) {
    next(err);
  }
};

export const createProductsHandler = async (req, res, next) => {
  try {
    const response = await ProductsService.createProducts(req);

    res.status(200).json({
      status: "success",
      data: response,
    });
  } catch (err) {
    next(err);
  }
};

export const updateProductsByIdHandler = async (req, res, next) => {
  try {
    await ProductsService.updateProductsById(req);

    res.status(200).json({
      status: "success",
      message: "Products successfully updated",
    });
  } catch (err) {
    next(err);
  }
};

export const deleteProductsByIdHandler = async (req, res, next) => {
  try {
    await ProductsService.deleteProductsById(req);

    res.status(200).json({
      status: "success",
      message: "Products successfully deleted",
    });
  } catch (err) {
    next(err);
  }
};
