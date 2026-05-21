import * as UserService from "../services/users.js";

export const getAllUserHandler = async (req, res, next) => {
  try {
    const response = await UserService.getAllUser(req);

    res.status(200).json({
      status: "success",
      data: response,
    });
  } catch (err) {
    next(err);
  }
};

export const getCurrentUserHandler = async (req, res, next) => {
  try {
    const response = await UserService.getCurrentUser(req);

    res.status(200).json({
      status: "success",
      data: response,
    });
  } catch (err) {
    next(err);
  }
};

export const getUserByIdHandler = async (req, res, next) => {
  try {
    const response = await UserService.getUserById(req);

    res.status(200).json({
      status: "success",
      data: response,
    });
  } catch (err) {
    next(err);
  }
};

export const createUserHandler = async (req, res, next) => {
  try {
    const response = await UserService.createUser(req);

    res.status(200).json({
      status: "success",
      data: response,
    });
  } catch (err) {
    next(err);
  }
};

export const updateUserByIdHandler = async (req, res, next) => {
  try {
    await UserService.updateUserById(req);

    res.status(200).json({
      status: "success",
      message: "User successfully updated",
    });
  } catch (err) {
    next(err);
  }
};

export const deleteUserByIdHandler = async (req, res, next) => {
  try {
    await UserService.deleteUserById(req);

    res.status(200).json({
      status: "success",
      message: "User successfully deleted",
    });
  } catch (err) {
    next(err);
  }
};
