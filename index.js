'use strict';

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const mongoose = require('mongoose');
const models = require('./models/models.js');
const path = require('path');

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, '../client/public/uploads');
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname);
	}
});

const upload = multer({
	storage: storage
}).single('image');

// Constants
const PORT = process.env.PORT || 80;
const HOST = '0.0.0.0';

const CLIENT_BUILD_PATH = path.join(__dirname, '../client/build');

// App
const app = express();

// Static files
app.use(express.static(CLIENT_BUILD_PATH));
// set Express to use json
app.use(express.json());
app.use(cors());

const mongoDB = 'mongodb+srv://vrin:vrin1sanidiot!@cluster0-qjtoh.mongodb.net/test?retryWrites=true&w=majority';
mongoose.connect(mongoDB, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


app.get("/questions", async (req, res) => {
	const questions = await models.Question.find({});
	try {
		res.send(questions);
	} catch (err) {
		res.status(500).send(err);
	}
});

// for debugging purposes
app.get("/responses", async (req, res) => {
	const responses = await models.Response.find({});
	try {
		res.send(responses);
	} catch (err) {
		res.status(500).send(err);
	}
});

app.get("/question/:id", async (req, res) => {
	models.Question.findById(req.params.id, async (err, question) => {
		if (err) {
			res.status(500).send(err);
		} else {
			let resJson = {
				body: question.body,
				date_asked: question.date_asked,
			}
			let choiceIds = question.choices.map(idStr => mongoose.Types.ObjectId(idStr));
			let choiceBodies= [];
			let choiceCounts = [];
			const choices = await models.Choice
				.aggregate([
					{
						$match: {
							"_id": {"$in": choiceIds}
						}
					},
					{
						$project: {
							body: true,
							choiceCount: {$size: "$responses"}
						}
					}
				]);
			choices.forEach(elem => {
				choiceBodies.push(elem.body);
				choiceCounts.push(elem.choiceCount);
			});
			resJson.choices = choiceBodies;
			resJson.counts = choiceCounts;
			res.status(200).json(resJson);
		}
	})
});

app.post("/question", async (req,res) => {
	try {
		const choiceIds = [];
		const choicesContent = req.body.choices;
		for (const elem of choicesContent) {
			let newId = new mongoose.Types.ObjectId();
			choiceIds.push(newId);
			const newChoice = new models.Choice({
				_id: newId,
				body: elem.choice
			});
			await newChoice.save();
		}
		const question = new models.Question({
			_id: new mongoose.Types.ObjectId(),
			body: req.body.body,
			date_asked: req.body.date_asked,
			choices: choiceIds
		});
		await question.save();
		res.send(question);
	} catch (err) {
		res.status(500).send(err);
	}
});

app.post("/response/:id", async (req,res) => {
	try {
		let responseId = new mongoose.Types.ObjectId();
		const newResponse = new models.Response({
			_id: responseId,
			gender: req.body.gender,
			age: req.body.age,
			race: req.body.race
		});
		await newResponse.save();

		let query = { _id: req.params.id },
		    options = {},
		    callback = function (err, result) { };
		models.Choice.updateOne(query, {$push: {'responses': responseId}}, options, callback)
		res.send(newResponse);
	} catch (err) {
		res.status(500).send(err);
	}
});

app.get("/questionData/:id", async (req, res) => {
	try {
		let result = [];
		const question = await models.Question.findById(req.params.id);
		const choiceIds = question.choices;
		const choices = await models.Choice
			.aggregate([
				{
					$match: {
						"_id": {"$in": choiceIds}
					}
				},
				{
					$project: {
						body: true,
						responses: true,
					}
				}
			]);
		for (const elem of choices) {
			const choiceName = elem.body;
			const responseIds = elem.responses;
			const counts = await models.Response
				.aggregate([
					{
						$match: {
							"_id": {"$in": responseIds}
						}
					},
					{ $facet:
							{
								"gender": [
									{
										$group: {
											"_id": '$gender',
											count: {
												$sum: 1
											}
										}
									}
								],
								"age": [
									{
										$group: {
											"_id": '$age',
											count: {
												$sum: 1
											}
										},
									}
								],
								"race": [
									{
										$group: {
											"_id": '$race',
											count: {
												$sum: 1
											}
										},
									}
								],
							}
					},
				]);
			let resultJson = JSON.parse(JSON.stringify(counts))
			resultJson[0].totalResponse = responseIds.length;
			let fullResult = {};
			fullResult[choiceName] = resultJson[0];
			result.push(fullResult);
		}
		res.status(200).json(result);
	} catch (err) {
		res.status(500).send(err);
	}
});

app.post('/auth', async (req, res) => {
	try {
		await models.Password.findOne().exec((err, passwordObj) => {
			if (err) {
				res.status(500).send(err);
			} else if (passwordObj.password === req.body.password) {
				res.status(200).json();
			} else {
				res.status(403).send();
			}
		});
	} catch (err) {
		res.status(500).send(err)
	}
});

// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
	response.sendFile(path.join(CLIENT_BUILD_PATH, 'index.html'));
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
