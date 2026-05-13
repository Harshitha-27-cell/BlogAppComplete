import exp from "express";
import { authenticate } from "../services/authService.js";
import { UserTypeModel } from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import { verifyToken } from "../middlewares/verifyToken.js";

export const commonRouter = exp.Router();

// login
commonRouter.post("/login", async (req, res) => {
  try {
    // get user credentials
    let userCred = req.body;

    // authenticate user
    let { token, user } = await authenticate(userCred);

    // save token as cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    // send response
    res.status(200).json({
      message: "login success",
      payload: user,
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: "Login failed",
    });
  }
});

// logout
commonRouter.get("/logout", (req, res) => {
  try {
    // clear token cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.status(200).json({
      message: "Logged out successfully",
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: "Logout failed",
    });
  }
});

// change password
commonRouter.put("/change-password", async (req, res) => {
  try {
    // get request data
    const { role, email, currentPassword, newPassword } = req.body;

    // prevent same password
    if (currentPassword === newPassword) {
      return res.status(400).json({
        message: "newPassword must be different from currentPassword",
      });
    }

    // find user
    const account = await UserTypeModel.findOne({ email });

    if (!account) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    // verify current password
    const isMatch = await bcrypt.compare(
      currentPassword,
      account.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Current password is incorrect",
      });
    }

    // hash new password
    account.password = await bcrypt.hash(newPassword, 10);

    // save updated password
    await account.save();

    res.status(200).json({
      message: "Password changed successfully",
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: "Password change failed",
    });
  }
});

// check authentication
commonRouter.get(
  "/check-auth",
  verifyToken("USER", "AUTHOR", "ADMIN"),
  (req, res) => {
    res.status(200).json({
      message: "authenticated",
      payload: req.user,
    });
  }
);