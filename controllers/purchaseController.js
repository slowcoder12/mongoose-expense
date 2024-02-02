const Orders = require("../models/orders");
const Razorpay = require("razorpay");
const User = require("../models/user");
require("dotenv").config();

const rpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.buyPremium = async (req, res) => {
  //console.log("result request", req.user.name);

  const userId = req.user.id;
  try {
    const amount = 2500;
    const currency = "INR";

    rpay.orders.create(
      {
        amount,
        currency,
      },
      async (err, order) => {
        if (err) {
          console.error("Error creating Razorpay order:", err);
          return res.status(500).json({ error: "Failed to create the order" });
        }

        try {
          const newOrder = new Orders({
            orderId: order.id,
            status: "PENDING",
            user: userId,
          });
          newOrder.save();
          console.log("creating order", newOrder);

          return res.status(201).json({
            order: newOrder,
            key_id: rpay.key_id,
          });
        } catch (error) {
          console.error("Error storing the order:", error);
          return res.status(500).json({ error: "Failed to create the order" });
        }
      }
    );
  } catch (error) {
    console.error("Error in the buyPremium controller:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateTransactionStatus = async (req, res) => {
  const { payment_id, order_id } = req.body;
  console.log(payment_id, order_id);

  try {
    // Update both payment ID and order status in the database
    const result = await Orders.findOne({
      orderId: order_id,
    });
    console.log("finding order id", result);
    if (result) {
      result.paymentId = payment_id;
      //console.log("ths is payment id ", result.paymentId);
      result.status = "SUCCESSFUL";

      await result.save();

      const user = await User.findById(req.user._id);

      if (user) {
        user.isPremium = true;
        await user.save();
      }

      res.status(200).json({ message: "Transaction status updated" });
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  } catch (error) {
    console.error("Error updating transaction status:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.checkPremium = async (req, res) => {
  const userId = req.user._id;
  try {
    const checkPrem = await User.findOne({
      _id: userId,
    });
    // console.log("rowwww==>", checkPrem);
    if (checkPrem.isPremium === true) {
      res.status(200).json(checkPrem.isPremium);
    }
  } catch (err) {
    console.log(err);
  }
};
