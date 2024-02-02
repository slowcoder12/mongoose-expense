const Expense = require("../models/expenseModel");
const User = require("../models/user");
const FilesDownloads = require("../models/fileDownloads");
const aws = require("aws-sdk");

exports.displayItems = async (req, res) => {
  console.log("ENTERED", req.user.id);
  try {
    const page = req.query.page || 1;
    let limit = req.query.limit || 10;
    limit = parseInt(limit);
    const offset = (page - 1) * limit;
    const expenses = await Expense.find({ user: req.user.id })
      .skip(offset)
      .limit(limit)
      .exec();
    const totalExpenses = await Expense.countDocuments({ user: req.user.id });
    console.log("RESPONSEEEEEEE", expenses);

    res.status(200).json({
      expenses: expenses,
      totalItems: totalExpenses,
      currentPage: page,
      totalPages: Math.ceil(totalExpenses / limit),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "err occured in displaying" });
  }
};

exports.leaderBoard = async (req, res) => {
  try {
    const expenses = await User.find({
      select: ["name", "totalExpense"],
      sort: { totalExpense: -1 },
    });
    res.status(200).json(expenses);
  } catch (err) {
    console.log(err);
  }
};

exports.downloadExpenses = async (req, res) => {
  try {
    const userId = req.user.id;
    const expenses = await Expense.find({ user: req.user.id });
    const stringfyexp = JSON.stringify(expenses);
    //console.log(stringfyexp);

    const filename = `Expense${userId}/${new Date()}.txt`;

    const fileURL = await uploadToS3(stringfyexp, filename);
    res.status(200).json({ fileURL });
  } catch (err) {
    res.status(500).json({ message: "err occured in displaying" });
  }
};

async function uploadToS3(data, filename) {
  const BUCKET_NAME = process.env.BUCKET_NAME;
  const IAM_USER_KEY = process.env.IAM_USER_KEY;
  const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

  let s3bucket = new aws.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
  });

  let params = {
    Bucket: BUCKET_NAME,
    Key: filename,
    Body: data,
    ACL: "public-read",
  };

  try {
    const uploadResponse = await s3bucket.upload(params).promise();
    console.log("Success", uploadResponse);
    return uploadResponse.Location;
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "error in uploading", success: false });
  }
}

exports.saveLink = async (req, res) => {
  const link = req.body.link;
  const id = req.user.id;
  //console.log(link);

  try {
    const result = new FilesDownloads({
      link: link,
      user: id,
    });

    await result.save();
  } catch (err) {
    console.log(err);
  }
};

exports.reportData = async (req, res) => {
  try {
    const expenses = await FilesDownloads.find({ user: req.user.id });
    //console.log(expenses);

    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ message: "err occured in displaying" });
  }
};
