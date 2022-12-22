require("dotenv").config();
const { MongoClient } = require("mongodb");

const url = `mongodb+srv://gilbert:${process.env.MONGO_PASSWORD}@lucy-calendar.fhmsfe0.mongodb.net/?retryWrites=true&w=majority`,
	client = new MongoClient(url);

const dbName = "lucy-calendar";

module.exports = () =>
	new Promise(async (res, rej) => {
		try {
			await client.connect();
			console.log("Connected successfully to server");
			const db = client.db(dbName);
			const documents = db.collection("documents");

			res(documents);
		} catch (e) {
			rej(e);
		}
	});
