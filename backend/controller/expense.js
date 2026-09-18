const Expenses = require("../schema/expenseSchema");

exports.getAllExpense = async (req, res) => {
  try {
    const allExpense = await Expenses.find({ userId: req.user.id }).sort({
      date: -1,
    });

    return res.status(200).json({
      message: "Successfully retrieved all expenses",
      expenses: allExpense,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.addExpense = async (req, res) => {
  try {
    const { title, amount, category, date, notes } = req.body;

    const expense = await Expenses.create({
      title,
      amount,
      category,
      date,
      notes,
      userId: req.user.id, // 👈 tag the owner
    });

    return res.status(201).json({
      message: "Expense added successfully",
      expense,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getExpensesById = async (req, res) => {
  try {
    const expense = await Expenses.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    return res.status(200).json({
      message: "Successfully retrieved expense",
      expense,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updateExpenses = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, category, date, notes } = req.body;

    const updatedExpense = await Expenses.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { title, amount, category, date, notes },
      { new: true, runValidators: true },
    );

    if (!updatedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    return res.status(200).json({
      message: "Expense updated successfully",
      expense: updatedExpense,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteExpenses = async (req, res) => {
  try {
    const deletedExpense = await Expenses.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    return res.status(200).json({
      message: "Expense deleted successfully",
      expense: deletedExpense,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
