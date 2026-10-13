const jwt = require("jsonwebtoken");
const User = require("../models/user");
const LabAssistant = require("../models/labAssistant");
const ApiResponse = require("../configs/api_response");
const SERECT_KEY = require("../helpers/constants");
const uploadToCloud = require("../configs/uploadToCloud");
const Employer = require("../models/emplyer");
const crypto = require('crypto');
const { deleteFromGCS } = require("../middlewares/fileUpload");

const OTP_CONFIG = {
  LENGTH: 6,
  EXPIRY_MINUTES: 10,
};


const generateOTP = (length = OTP_CONFIG.LENGTH) => {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return crypto.randomInt(min, max + 1).toString();
};

const isOTPExpired = (expiryDate) => {
  return new Date() > new Date(expiryDate);
};

// controllers/user_controller.js  (or wherever signUp lives)
const signUp = async (req, res) => {
  console.log("CT:", req.headers["content-type"]);
  console.log("FILES:", Object.keys(req.files || {}));
    try {
    // Multer .fields() puts files here: req.files.labLogo = [fileObj]
    const pickUrl = (fieldName) => {

      const arr = req.files?.[fieldName];

      if (!arr || !arr.length) return null;
      return arr[0].path; // GCS public URL, set by GCSMulterStorage
    };

    const labLogoUrl       = pickUrl("labLogo");
    const labImageUrl      = pickUrl("labImage");
    const labReportImageUrl = pickUrl("labReportImage");

    const user = await User.create({
      name:              req.body.name,
      phoneNumber:       req.body.phoneNumber,
      qualification:     req.body.qualification,
      pin:               req.body.pin,
      state:             req.body.state,
      district:          req.body.district,
      area:              req.body.area,
      labName:           req.body.labName,
      labLogo:           labLogoUrl,
      labImage:          labImageUrl,
      labReportImage:    labReportImageUrl,
      labReport:         req.body.labReport,
    });

    const token = jwt.sign(
      { uuid: user.uuid },
      process.env.SECRET_KEY,
      { expiresIn: "3y" }
    );

    return ApiResponse.success(res, { authToken: token, user });
  } catch (error) {
    console.error("Signup failed:", error);
    return ApiResponse.error(res, error.message || "Something went wrong", 500);
  }
};

const login = async (req, res) => {
  const { phoneNumber, pin } = req.body;
  const { isAdmin } = req.query;

  const user = await User.findOne({
    where: {
      phoneNumber,
      pin,
    },
  });

  console.log(user, "user");
  const labAssistant = await LabAssistant.findOne({
    where: {
      phoneNumber,
      pin,
    },
  });
  console.log(labAssistant, "lab Assistant");
  const employer = await Employer.findOne({
    where: {
      password: pin,
      phone: phoneNumber,
    },
  });
  console.log(employer, "employer");

  if (user) {
    user.isActive = true;
    user.lastLogin = new Date();
    await user.save();
    if (user.status == "2")
      return ApiResponse.error(
        res,
        "Thank you for your registration. Your account will be approved with 24 hours ",
        200,
        user
      );

    if (isAdmin) {
      if (user.get().role !== "admin")
        return ApiResponse.error(res, "User has no privilege", 400, user);
    }

    const token = jwt.sign({ uuid: user.uuid }, SERECT_KEY, {
      expiresIn: "3y",
    });
    return ApiResponse.success(res, {
      authToken: token,
      user: user,
      type: "User",
    });
  }
  if (labAssistant) {
    if (labAssistant?.status != "Approved") {
      let newsList = await LabAssistant.update(
        { status: "Pending" },
        {
          where: { phoneNumber, pin },
        }
      );
      return ApiResponse.isNotApprovedAlreadyExist(
        res,
        201,
        "Thank you for your registration. Your account will be approved with 24 hours ",
        labAssistant
      );
    }
    const token = jwt.sign({ uuid: labAssistant.uuid }, SERECT_KEY, {
      expiresIn: "3y",
    });
    return ApiResponse.success(res, {
      authToken: token,
      user: labAssistant,
      type: "Assistant",
    });
  }

  if (employer) {
    const token = jwt.sign(
      { id: employer.id, phone: employer.phone, password: employer.password },
      SERECT_KEY,
      {
        expiresIn: "3y",
      }
    );
    return ApiResponse.success(res, {
      authToken: token,
      user: employer,
      type: "User",
    });
  }
  return ApiResponse.error(res, "Not found", 404);
};

// const login = async (req, res) => {
//   console.log(" USERRR ", req.body);
//   const { phoneNumber, pin } = req.body;
//   const { isAdmin } = req.query;

//   // Check User
//   const user = await User.findOne({
//     where: {
//       phoneNumber,
//       pin,
//     },
//   });
//   console.log(user, "user");

//   // Check Lab Assistant
//   const labAssistant = await LabAssistant.findOne({
//     where: {
//       phoneNumber,
//       pin,
//     },
//   });
//   console.log(labAssistant, "lab Assistant");

//   // Check Employer
//   const employer = await Employer.findOne({
//     where: {
//       password: pin,
//       phone: phoneNumber,
//     },
//   });
//   console.log(employer, "employer");

//   if (user) {
//     user.isActive = true;
//     user.lastLogin = new Date();
//     await user.save();
//     if (user.status == "2")
//       return ApiResponse.error(
//         res,
//         "Thank you for your registration. Your account will be approved within 24 hours",
//         200,
//         user
//       );

//     if (isAdmin) {
//       if (user.get().role !== "admin")
//         return ApiResponse.error(res, "User has no privilege", 400, user);
//     }

//     const token = jwt.sign({ uuid: user.uuid }, SERECT_KEY, {
//       expiresIn: "3y",
//     });
//     return ApiResponse.success(res, {
//       authToken: token,
//       user: user,
//       type: "User",
//     });
//   }

//   if (labAssistant) {
//     if (labAssistant?.status != "Approved") {
//       await LabAssistant.update(
//         { status: "Pending" },
//         {
//           where: { phoneNumber, pin },
//         }
//       );
//       return ApiResponse.isNotApprovedAlreadyExist(
//         res,
//         201,
//         "Thank you for your registration. Your account will be approved within 24 hours",
//         labAssistant
//       );
//     }
//     const token = jwt.sign({ uuid: labAssistant.uuid }, SERECT_KEY, {
//       expiresIn: "3y",
//     });
//     return ApiResponse.success(res, {
//       authToken: token,
//       user: labAssistant,
//       type: "Assistant",
//     });
//   }

//   if (employer) {

//     const token = jwt.sign(
//       { uuid: employer.id, role: employer.phoneNumber },
//       SERECT_KEY,
//       {
//         expiresIn: "3y",
//       }
//     );
//     return ApiResponse.success(res, {
//       authToken: token,
//       user: employer,
//       type: "Employer",
//     });
//   }

//   return ApiResponse.error(res, "Not found", 404);
// };

const sendOTP = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({
        error: "Mobile number is required",
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Find user
    const user = await User.findOne({
      where: { phoneNumber },
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    await user.update({
      otp,
      otpExpiry,
    });

    console.log("Generated OTP:", otp);
    console.log("Generated OTP Expiry:", otpExpiry);

      return res.status(200).json({
        success: true,
        message: "OTP sent",
        otp,               // use variable
        otpExpiry,         // use variable
        userId: user.id,
      });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
// ─── Verify OTP ──────────────────────────────────────────────────────
const verifyOTP = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;
    console.log("very Body phoneNumber", phoneNumber)
    console.log("very Body otp", otp)
    if (!phoneNumber || !otp) {
      return res.status(400).json({ error: 'Mobile and OTP are required' });
    }

    const user = await User.findOne({ where: { phoneNumber } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check OTP expiry
    if (isOTPExpired(user.otpExpiry)) {
      return res.status(400).json({ error: 'OTP has expired' });
    }

    // Verify OTP
    if (user.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Update user details if provided (for registration flow)
    const updates = { otp: null, otpExpiry: null };
    await user.update(updates);

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      user
    });
  } catch (error) {
    console.error(error)
  }
};

// ─── Resend OTP ──────────────────────────────────────────────────────
const resendOTP = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ error: 'Mobile number is required' });
    }

    const user = await User.findOne({ where: { phoneNumber } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newOtp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await user.update({ otp: newOtp, otpExpiry });

    if (process.env.NODE_ENV === 'development') {
      return res.status(200).json({
        success: true,
        message: 'OTP resent',
        otp: newOtp,
      });
    }

    res.status(200).json({ success: true, message: 'OTP resent successfully' });
  } catch (error) {
    console.error(error)
  }
};

const getTotalAndActiveUsers = async () => {
  try {
    const totalUsers = await User.count();
    const activeUsers = await User.count({ where: { isActive: true } });

    console.log(`Total Users: ${totalUsers}`);
    console.log(`Active Users: ${activeUsers}`);

    return { totalUsers, activeUsers };
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

// Example call
getTotalAndActiveUsers().then((data) => console.log(data));

const userProfile = async (req, res) => {
  // await User.sync();
  ApiResponse.success(res, req.body.user);
};

const getAllUsers = async (req, res) => {
  let users = await User.findAll({
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: User,
        as: "approver",
        attributes: ["name", "phoneNumber"],
      },
    ],
  });
  if (!users) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, users);
};

const changeUserStatus = async (req, res) => {
  const { userId } = req.body;
  if (!userId) return ApiResponse.error(res, "User ID Not Found", 400);

  let user = await User.update(
    {
      status: req.body.status,
    },
    { where: { id: userId } }
  );
  if (!user) return ApiResponse.error(res, "Something Went Wrong", 400);

  return ApiResponse.success(res, user);
};
const changePassword = async (req, res) => {
  const { phoneNumber, pin } = req.body;
  if (!phoneNumber)
    return ApiResponse.error(res, "Phone number is not Found", 400);

  let user = await User.update(
    {
      pin,
    },
    { where: { phoneNumber: phoneNumber } }
  );
  if (!user) return ApiResponse.error(res, "Something Went Wrong", 400);

  return ApiResponse.success(res, user);
};

const logout = async (req, res) => {
  const userId = req.params.id;

  let user = await User.update(
    {
      isActive: false,
    },
    { where: { id: userId } }
  );
  if (!user) return ApiResponse.error(res, "Something Went Wrong", 400);

  return ApiResponse.success(res, user);
};
const approveUser = async (req, res) => {
  const { id } = req.params;
  const usr = req.body?.user;
  const data = {
    status: "1",
    approvedDate: new Date(),
    approvedBy: usr?.id,
  };

  let user = await User.update(data, {
    where: { id: id },
  });
  if (!user) return ApiResponse.error(res, "Something Went Wrong", 400);

  return ApiResponse.success(res, user);
};

const updateUser = async (req, res) => {
  const id = req.params.id;

  try {
    const usr = { ...req.body };

    console.log("Files:", req.files);
    console.log("Body:", req.body);

    const userData = await User.findByPk(id);

    if (!userData) {
      return ApiResponse.error(res, "User not found", 404);
    }

    // Handle labLogo
    const labLogoFile = req.files?.labLogo?.[0];

    if (labLogoFile) {
      const newLogoUrl =
        labLogoFile.publicUrl || labLogoFile.path;

      const oldLogoUrl = userData.labLogo;

      // Delete old image only when replacing it
      if (oldLogoUrl && oldLogoUrl !== newLogoUrl) {
        await deleteFromGCS(oldLogoUrl);
      }

      usr.labLogo = newLogoUrl;
    }

    // Handle labImage
    const labImageFile = req.files?.labImage?.[0];

    if (labImageFile) {
      const newLabImageUrl =
        labImageFile.publicUrl || labImageFile.path;

      const oldLabImageUrl = userData.labImage;

      if (
        oldLabImageUrl &&
        oldLabImageUrl !== newLabImageUrl
      ) {
        await deleteFromGCS(oldLabImageUrl);
      }

      usr.labImage = newLabImageUrl;
    }

    // Handle labReportImage
    const labReportFile = req.files?.labReportImage?.[0];

    if (labReportFile) {
      const newReportUrl =
        labReportFile.publicUrl || labReportFile.path;

      const oldReportUrl = userData.labReportImage;

      if (
        oldReportUrl &&
        oldReportUrl !== newReportUrl
      ) {
        await deleteFromGCS(oldReportUrl);
      }

      usr.labReportImage = newReportUrl;
    }

    // Update only the supplied fields and newly uploaded files
    await userData.update(usr);

    const updatedUser = await User.findByPk(id);

    return ApiResponse.success(res, updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);

    return ApiResponse.error(
      res,
      "An error occurred while updating the user",
      500
    );
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  if (!id) return ApiResponse.error(res, "User Id is not Found", 400);

  let user = await User.destroy({
    where: { id: id },
  });
  if (user == 0) return ApiResponse.error(res, "No User with this id", 404);

  return ApiResponse.success(res, user);
};

const findUser = async (req, res) => {
  const { id } = req.params;
  let user = await User.findByPk(id, {
    include: [
      {
        model: User, // Include the approver (User) model
        as: "approver", // Use the alias you defined in the User model
        attributes: ["name", "phoneNumber"], // Specify the attributes you want to include
      },
    ],
  });
  if (!user) return ApiResponse.error(res, "No User with this id", 404);

  return ApiResponse.success(res, user);
};
module.exports = {
  signUp,
  verifyOTP,
  login,
  sendOTP,
  userProfile,
  getAllUsers,
  changeUserStatus,
  changePassword,
  deleteUser,
  approveUser,
  updateUser,
  findUser,
  resendOTP,
  logout,
};
