const mongoose = require("mongoose");
const User = require("./models/User");

const MONGO_URI = "mongodb://localhost:27017/ai-kidtutor";

async function resetAdminPassword() {
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

    // Reset password to "admin123"
    adminUser.password = "admin123";
    await adminUser.save();

    console.log("✅ Admin password reset to: admin123");

    // Test the password
    const isPasswordValid = await adminUser.comparePassword("admin123");
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

resetAdminPassword();
