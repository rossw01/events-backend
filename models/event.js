const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
	name: String,
	description: String,
	location: String,
	date: String,
	time: String,
	image: String,
	username: String,
});

module.exports.Event = mongoose.model("Event", eventSchema);
