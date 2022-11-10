const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
	username: {
		type: String,
		unique: true,
	},
	password: String,
	token: String,
});

module.exports.User = mongoose.model("User", userSchema);
