const express = require("express");
const {
  getAllExpense,
  deleteExpenses,
  addExpense,
  updateExpenses,
  getExpensesById,
} = require("../controller/expense");
const { userAuth } = require("../auth/userAuth");
const route = express.Router();
route.get("/", userAuth, getAllExpense);
route.post("/", userAuth, addExpense);
route.get("/:id", userAuth, getExpensesById);

route.delete("/:id", userAuth, deleteExpenses);

route.put("/:id", userAuth, updateExpenses);
module.exports = route;
