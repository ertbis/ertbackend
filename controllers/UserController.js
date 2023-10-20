const User = require("../models/User");
const { cloudinary } = require("../utils/cloudinary");
const { validateBody } = require("../utils/utilityFunctions");



//Controler function to get all users
const getAll = async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).send(users);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  };
  
  //Controller function to get one user
  const show = async (req, res) => {
    if (validateBody(req, res)) {
      return;
    }
    try {
      const userId = req.params.id;
      // Check if user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "user not found" });
      }
      return res.status(200).json(user);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Failed to get user", error: error.message });
    }
  };

//controller function to update an user
const update = async (req, res) => {
  if (validateBody(req, res)) {
    return;
  }
  try {
    const userId = req.user.user_id;
    const updateData = req.body;
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.set(updateData);


        if (updateData.bankName) {
          user.bankDetails.bankName = updateData.bankName;
        }
        if (updateData.acctName) {
          user.bankDetails.acctName = updateData.acctName;
        }
        if (updateData.acctNumber) {
          user.bankDetails.acctNumber = updateData.acctNumber;
        }
      


    // Update user fields
    if (updateData.email) {
      const existingUser = await User.findOne({ email: updateData.email });
      if (existingUser && existingUser._id.toString() !== userId) {
        return res.status(409).json({ message: "User with this email already exists" });
      }
      user.email = updateData.email.toLowerCase();
    }
    if (updateData.password) {
      const encryptedPassword = await bcrypt.hash(updateData.password, 10);
      user.password = encryptedPassword;
    }

    // Add code to handle profile picture upload to Cloudinary
    if (updateData.profilePicture) {
      // Assuming you have a form field named 'profilePicture' for uploading the image
      const result = await cloudinary.uploader.upload(updateData.profilePicture, (err, result)=>{
        if (err) {
          return res.status(500).json({ message: "Image upload failed" , err});
        }
      });

      // Save the Cloudinary URL to the user's profile picture field
      user.profilePicture = result.secure_url;
    }






    // Update the 'updated_at' field with the current timestamp
    user.updated_at = new Date();

    // Save the updated user
    const updatedUser = await user.save();

    // Send response with updated user and a success message
    return res.status(200).json({
      user: updatedUser,
      message: "User updated successfully",
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Failed to update user", error: error.message });
  }
};





    //Controller function to get one user
    const showMyDetail = async (req, res) => {
      try {
        const userId = req.user.user_id
        // Check if user exists
        const user = await User.findById(userId).select("-password");
        if (!user) {
          return res.status(404).json({ message: "user not found" });
        }
        return res.status(200).json(user);
      } catch (error) {
        console.log(error)
        return res
          .status(500)
          .json({ message: "Failed to get user", error: error.message });
      }
    };
  



  
 
  //Controller function to delete one user
  const destroy = async (req, res) => {
    if (validateBody(req, res)) {
      return;
    }
    try {
      const userId = req.params.id;
      // Check if user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "user not found" });
      }
      // Delete the user
      await User.findByIdAndDelete(userId);
      // Send response indicating successful deletion
      return res.status(200).json({ message: "user deleted successfully" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Failed to delete user", error: error.message });
    }
  };
  
  module.exports = {
    getAll,
    show,
    destroy,
    update,
    showMyDetail
  };
  