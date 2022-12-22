const fs = require("fs");

const basePath = "./data/2023";

const dirs = fs
	.readdirSync(basePath, { withFileTypes: true })
	.filter((f) => f.isDirectory())
	.map((f) => f.name);

for (const n of dirs) {
	const c = fs.readFileSync(`${basePath}/${n}/data.json`, {
		encoding: "utf-8",
	});
	fs.writeFileSync(`./data/2023-${n}.json`, c);

	console.log("dun");
}
