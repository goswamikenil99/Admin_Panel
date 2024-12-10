const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); // Using bcrypt instead of bcryptjs
const jwt = require("jsonwebtoken");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await mongoose.connection.db
      .collection("users")
      .find()
      .toArray();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.body; // Extract user ID from body
    if (!id) return res.status(400).json({ message: "User ID is required" });

    // Attempt to find the user
    const user = await mongoose.connection.db
      .collection("users")
      .findOne({ _id: new mongoose.Types.ObjectId(id) });

    if (!user) {
      // If user is not found, create a fake user object
      const fakUser = {
        _id: new mongoose.Types.ObjectId(),
        email: "kenilgoswami581@gmail.com",
        password:
          "$2b$10$cFoPRbLS63GmKys8Yntr1uAukLXZo5wp8Tt4jKZ0gUKBlE7f7ns1u", // Example password (hashed)
        profileSetup: true,
        __v: 0,
        color: 0,
        firstName: "user", // Set first name as 'user'
        lastName: "Deleted", // Set last name as 'Deleted'
        image: "uploads/profiles/1731424960408SAVE_20241014_151641.jpg", // Example image URL
      };

      // Send the fake user object in the response
      return res.status(404).json(fakUser);
    }

    // If user is found, return the user details
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.body; // Using req.body instead of req.params
    // console.log(id)
    await mongoose.connection.db
      .collection("users")
      .deleteOne({ _id: new mongoose.Types.ObjectId(id) });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePassword = async (req, res) => {
  const { userId, password } = req.body;

  if (!userId || !password) {
    return res
      .status(400)
      .json({ message: "User ID and password are required" });
  }

  try {
    // Hash the plain text password using bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update the user's password in the database
    await mongoose.connection.db
      .collection("users")
      .updateOne(
        { _id: new mongoose.Types.ObjectId(userId) },
        { $set: { password: hashedPassword } }
      );

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Failed to update password" });
  }
};

exports.get_by_id = async (req, res) => {
  const { userId } = req.body; // Get userId from request body
  try {
    const user = await User.findById(userId); // Find the user by ID
    if (user) {
      res.status(200).json(user); // Send the user details as a response
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin login route
exports.admin_login = async (req, res) => {
  // console.log("hello")
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Access the `admin` collection directly
    const admin = await mongoose.connection.db
      .collection("admin")
      .findOne({ email });

    if (!admin) {
      return res.status(401).json({ message: "Admin not found" });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // // Generate JWT token for authentication
    // const token = jwt.sign(
    //   { email: admin.email, id: admin._id }, // Payload
    //   JWT_SECRET,
    //   { expiresIn: "1h" } // Expiration time
    // );

    // Respond with success message and JWT token
    // Generate JWT
    const token = jwt.sign({ id: admin._id }, 'kenilgoswami', { expiresIn: "1h" });
    // console.log('Generated Token:', token); // Log token to verify creation

    // Send JWT in HttpOnly Cookie
    res.cookie("token", token, {
      secure: true,
      sameSite: "None",  // Optional: Explicitly set the domain if needed
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    res.json({ message: "Login successful" });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
};
