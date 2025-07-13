const mongoose = require("mongoose");
const User = require("./models/User");

const MONGO_URI = "mongodb://localhost:27017/ai-kidtutor";

async function testLogin() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    // Test login with admin credentials
    const email = "admin@email.com";
    const password = "admin123";

    console.log(`\n🔐 Testing login for: ${email}`);

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found!");
      return;
    }

    console.log("✅ User found:", user.name, `(Role: ${user.role})`);

    // Test password
    const isPasswordValid = await user.comparePassword(password);
    console.log("✅ Password valid:", isPasswordValid ? "YES" : "NO");

    if (isPasswordValid) {
      console.log("🎉 Login would be successful!");
    } else {
      console.log("❌ Login would fail - wrong password");
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

testLogin();
