import exp from "express";
import { register } from "../services/authService.js";
import { ArticleModel } from "../models/ArticleModel.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { upload } from "../config/multer.js";
import cloudinary from "../config/cloudinary.js";
import { uploadToCloudinary } from "../config/cloudinaryUpload.js";

export const userRoute = exp.Router();

// register user
userRoute.post("/users", upload.single("profileImageUrl"), async (req, res, next) => {
  let cloudinaryResult;

  try {
    let userObj = req.body;

    if (req.file) {
      cloudinaryResult = await uploadToCloudinary(req.file.buffer);
    }

    const newUserObj = await register({
      ...userObj,
      role: "USER",
      profileImageUrl: cloudinaryResult?.secure_url,
    });

    res.status(201).json({
      message: "user created",
      payload: newUserObj,
    });
  } catch (err) {
    if (cloudinaryResult?.public_id) {
      await cloudinary.uploader.destroy(cloudinaryResult.public_id);
    }

    next(err);
  }
});

// get all articles
userRoute.get("/articles", verifyToken("USER"), async (req, res) => {
  const articles = await ArticleModel.find({ isArticleActive: true })
    .populate("comments.user", "email firstName");

  res.status(200).json({ message: "all articles", payload: articles });
});

// add comment
userRoute.post("/article/:id/comment", verifyToken("USER"), async (req, res) => {
  try {
    const articleId = req.params.id;
    const { comment } = req.body;

    const updatedArticle = await ArticleModel.findByIdAndUpdate(
      articleId,
      {
        $push: {
          comments: {
            user: req.user.userId,
            comment,
          },
        },
      },
      { new: true }
    ).populate("comments.user", "email firstName");

    if (!updatedArticle) {
      return res.status(404).json({ message: "article not found" });
    }

    res.status(200).json({
      message: "comment added",
      payload: updatedArticle,
    });
  } catch (err) {
    res.status(500).json({ message: "failed to add comment" });
  }
});

// search articles
userRoute.get("/articles/search/:keyword", async (req, res) => {
  try {
    const keyword = req.params.keyword;

    const articles = await ArticleModel.find({
      isArticleActive: true,
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { content: { $regex: keyword, $options: "i" } },
      ],
    });

    res.status(200).json({ message: "articles found", payload: articles });
  } catch (err) {
    res.status(500).json({ message: "search failed" });
  }
});