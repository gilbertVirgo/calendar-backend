const fs = require("fs");
const { DateTime } = require("luxon");
const express = require("express");
const app = express();

app.use(express.json());
app.use(require("cors")());

const basePath = "./data";

const buildJSON = ({ year, month }) => {
	const dateTime = DateTime.local(+year, +month);

	const firstDay = dateTime.startOf("month").weekday,
		days = Array(dateTime.daysInMonth + firstDay)
			.fill(null)
			.map(
				(v, index) =>
					index >= firstDay && {
						day: index + 1 - firstDay,
						events: [],
					}
			);

	return {
		year,
		month,
		days,
	};
};

const getPathsFromParams = ({ year, month }) => ({
	dirPath: `${basePath}/${year}/${month}`,
	filePath: `${basePath}/${year}/${month}/data.json`,
});

app.get("/calendar/:year/:month", async (req, res) => {
	const { year, month } = req.params;
	const { dirPath, filePath } = getPathsFromParams({ year, month });

	await fs.promises
		.access(filePath, fs.constants.F_OK)
		.catch(async (error) => {
			console.log("Caught error", error);
			console.log("Henceforth unrecorded month. Making new file...");

			await fs.promises.mkdir(dirPath, { recursive: true });
			await fs.promises.writeFile(
				filePath,
				JSON.stringify(buildJSON({ year, month })),
				{ encoding: "utf-8" }
			);
		});

	const data = await fs.promises.readFile(filePath, { encoding: "utf-8" });

	res.status(200).send({ success: true, data });
});

const isValidData = (data) => {
	// Should probably validate it somehow.

	return data !== null;
};

// For some reason, cannot get any req.body stuff coming through here
app.post("/calendar/:year/:month", async (req, res) => {
	const { year, month } = req.params;
	const { filePath } = getPathsFromParams({ year, month });
	const { data } = req.body;

	if (!isValidData(data))
		res.status(400).json({ success: false, message: "Invalid data." });

	await fs.promises.writeFile(filePath, JSON.stringify(data), {
		encoding: "utf-8",
	});

	res.status(200).json({ success: true });
});

app.listen(4000, () => console.log(`app started on 4000`));
