const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");

const MONGO_URI = "mongodb://localhost:27017/ai-kidtutor";

async function fixAdminPassword() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    // Find admin user
    const adminUser = await User.findOne({ email: "admin@email.com" });

    if (!adminUser) {
      console.log("❌ Admin user not found!");
      return;
    }

    console.log("✅ Admin user found:", adminUser.email);

    // Hash the password manually
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);

    // Update the password directly in the database
    await User.updateOne(
      { email: "admin@email.com" },
      { password: hashedPassword }
    );

    console.log("✅ Admin password updated to: admin123");

    // Test the password
    const updatedUser = await User.findOne({ email: "admin@email.com" });
    const isPasswordValid = await updatedUser.comparePassword("admin123");
    console.log(
      "✅ Password test result:",
      isPasswordValid ? "SUCCESS" : "FAILED"
    );

    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

fixAdminPassword();
