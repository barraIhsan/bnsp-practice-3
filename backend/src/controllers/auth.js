import * as AuthService from "../services/auth.js";

export const registerHandler = async (req, res, next) => {
  try {
    await AuthService.register(req);

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const loginHandler = async (req, res, next) => {
  try {
    const response = await AuthService.login(req, res);

    res.status(200).json({
      status: "success",
      data: response,
    });
  } catch (err) {
    next(err);
  }
};

export const logoutHandler = async (_req, res, next) => {
  try {
    await AuthService.logout(res);

    res.status(200).json({
      status: "success",
      message: "Logged out",
    });
  } catch (err) {
    next(err);
  }
};

export const refreshHandler = async (req, res, next) => {
  try {
    const response = await AuthService.refresh(req, res);

    res.status(200).json({
      status: "success",
      data: response,
    });
  } catch (err) {
    next(err);
  }
};
