const Expense = require("../models/expenseModel");
const User = require("../models/user");

exports.addExpense = async (req, res) => {
  const { amount, description, category } = req.body;
  const userId = req.user.id;
  try {
    const result = new Expense({
      amount: amount,
      description: description,
      category: category,
      user: userId,
    });

    await result.save();

    const user = await User.findOne({ _id: userId });
    if (user) {
      user.totalExpense += parseInt(amount);
      await user.save();
    }

    console.log("Expense added");
    //console.log(result);
    res.status(200).json({ result, message: "expense added successfully" });
  } catch (err) {
    console.log("error occured in adding", err);
    res.status(500).json({ message: "An error occurred" });
  }
};

exports.deleteExpense = async (req, res) => {
  const id = req.params.id;
  const sid = id.toString();
  console.log("expense Id", sid);

  try {
    const expense = await Expense.findById(sid);

    console.log("returend expense when trying to delte", expense);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    const userId = expense.user.toString();
    const amount = expense.amount;
    console.log("amount", amount);
    console.log("id", userId);

    const result = await Expense.deleteOne({ _id: sid });

    if (result) {
      const user = await User.findOne({ _id: userId });
      console.log("USER AFTER DELETUNG", user);
      if (user) {
        user.totalExpense -= amount;
        await user.save();
      }

      res.status(200).json({ message: "Expense deleted successfully" });
    } else {
      res.status(500).json({ message: "An error occurred" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An error occurred" });
  }
};

exports.displayItems = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id });

    res.status(200).json(expenses);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "err occured in displaying" });
  }
};

exports.leaderBoard = async (req, res) => {
  try {
    const expenses = await User.find().sort({ totalExpense: -1 });
    console.log("after sorting", expenses);
    res.status(200).json(expenses);
  } catch (err) {
    console.log(err);
  }
};
