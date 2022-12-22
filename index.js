const populateEmptyMonth = require("./populateEmptyMonth");

const express = require("express"),
	server = express(),
	connect = require("./connect");

const cors = require("cors");

const { PORT } = process.env;

server.use(express.json());
server.use(cors());

const init = async () => {
	const db = await connect();

	server.get("/:year/:month", async ({ params }, res, next) => {
		const { year, month } = params;
		let data = await db.find({ year, month }).toArray();

		if (!data.length) {
			// Nothing here...
			await populateEmptyMonth({ year, month }).on(db);

			// refresh
			data = await db.find({ year, month }).toArray();
		}

		res.locals.data = data;
		next();
	});

	server.get("/:year/:month/:day", async ({ params }, res, next) => {
		const { year, month, day } = params;

		const data = await db.findOne({ year, month, day });
		res.locals.data = data;
		next();
	});

	server.patch("/:year/:month/:day", async ({ params, body }, res, next) => {
		const { year, month, day } = params;

		const data = await db
			.updateOne({ year, month, day }, { $set: body })
			.catch(next);

		res.locals.data = data;
		next();
	});

	server.use((req, res, next) => {
		res.status(200).json({
			success: true,
			data: res.locals.data,
		});
	});

	server.use((err, req, res, next) => {
		res.status(500).json({
			success: false,
			message: err.toString(),
		});
	});

	server.listen(PORT, () => console.log(`Started server on ${PORT}`));
};

init();
