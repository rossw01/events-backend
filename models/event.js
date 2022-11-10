const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
	name: String,
	description: String,
	location: String,
	date: String,
	time: String,
	image: String,
	user: String,
});

module.exports.Event = mongoose.model("Event", eventSchema);
