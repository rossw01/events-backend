/// importing the dependencies
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const port = process.env.PORT;
const dburi = process.env.DBURI;

const { Event } = require("./models/event");
const { User } = require("./models/user");

// Connect to mongoose app from .env files
mongoose.connect(dburi, { useNewUrlParser: true, useUnifiedTopology: true });

// defining the Express app
const app = express();

// adding Helmet to enhance your API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan("combined"));

app.post("/auth", async (req, res) => {
	// Auth login function
	const user = await User.findOne({
		userName: req.body.userName,
		password: req.body.password,
	});
	if (!user) {
		// Username not found in DB
		return res.sendStatus(401);
	}
	if (req.body.password !== user.password) {
		// Password not matching
		return res.sendStatus(403);
	}
	// Set unique token
	user.token = uuidv4();
	// Update changes to user in the db (to save the new token)
	await user.save();
	// TODO: come back to me
	res.send({ token: user.token });
});

app.post("/register", async (req, res) => {
	const newUser = req.body;
	const user = new User(newUser);
	await user.save();
	res.send({ message: "New account created." });
});

// custom midddleware
// Check users in db against token generated line 53
// TODO: Ask vincent about if this is necessary

// app.use(async (req, res, next) => {
// 	const user = await User.findOne({ token: req.headers.authorization });
// 	if (user) {
// 		next();
// 	} else {
// 		res.sendStatus(403);
// 	}
// });

//PROTECTED ROUTES
// defining CRUD operations
app.get("/", async (req, res) => {
	res.send(await Event.find());
});

app.get("/user/:id", async (req, res) => {
	await User.find({ token: req.params.id }, (error, data) => {
		res.send(data);
	});
});

app.post("/", async (req, res) => {
	// Create new ad and add to db
	const newEvent = req.body;
	const event = new Event(newEvent);
	await event.save();
	res.send({ message: "New event inserted." });
});

// Delete by specified ID
app.delete("/:id", async (req, res) => {
	await Event.deleteOne({ _id: ObjectId(req.params.id) });
	res.send({ message: "Event removed." });
});

app.post("/:id", async (req, res) => {
	await Event.findOneAndUpdate({ _id: ObjectId(req.params.id) }, req.body);
	res.send({ message: "Events updated." });
});

// starting the server
app.listen(port, () => {
	console.log(`listening on port ${port}`);
});

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function callback() {
	console.log("Database connected!");
});
