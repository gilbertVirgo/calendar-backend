const moment = require("moment");

module.exports = ({ year, month }) => {
	const days = Array(moment(`${year}-${month}`).daysInMonth())
		.fill({ year, month, events: [] })
		.map((v, i) => {
			return { ...v, day: `${i + 1}` };
		});

	return {
		on: async (db) => {
			await db.insertMany(days);
		},
	};
};
