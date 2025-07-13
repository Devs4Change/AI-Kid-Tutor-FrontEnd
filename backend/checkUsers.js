const mongoose = require("mongoose");
const User = require("./models/User");

const MONGO_URI = "mongodb://localhost:27017/ai-kidtutor";

async function checkUsers() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    const users = await User.find({});
    console.log("\n👥 Users in database:");
    users.forEach((user) => {
      console.log(`- ${user.name} (${user.email}) - Role: ${user.role}`);
    });

    console.log(`\n📊 Total users: ${users.length}`);

    // Check specifically for admin user
    const adminUser = await User.findOne({ email: "admin@email.com" });
    if (adminUser) {
      console.log("\n✅ Admin user found:", adminUser.email);
    } else {
      console.log("\n❌ Admin user NOT found!");
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

checkUsers();
