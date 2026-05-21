import * as TransactionsService from "../services/transactions.js";

export const getTransactionsHandler = async (req, res, next) => {
  try {
    const response = await TransactionsService.getTransactions(req);

    res.status(200).json({
      status: "success",
      data: response,
    });
  } catch (err) {
    next(err);
  }
};

export const getTransactionsByIdHandler = async (req, res, next) => {
  try {
    const response = await TransactionsService.getTransactionsById(req);

    res.status(200).json({
      status: "success",
      data: response,
    });
  } catch (err) {
    next(err);
  }
};

export const createTransactionsHandler = async (req, res, next) => {
  try {
    const response = await TransactionsService.createTransactions(req);

    res.status(200).json({
      status: "success",
      data: response,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteTransactionsByIdHandler = async (req, res, next) => {
  try {
    await TransactionsService.deleteTransactionsById(req);

    res.status(200).json({
      status: "success",
      message: "Transactions successfully deleted",
    });
  } catch (err) {
    next(err);
  }
};

export const getTransactionsSummaryHandler = async (req, res, next) => {
  try {
    const response = await TransactionsService.getTransactionsSummary(req);

    res.status(200).json({
      status: "success",
      data: response,
    });
  } catch (err) {
    next(err);
  }
};
