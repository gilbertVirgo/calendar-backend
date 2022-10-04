const { DateTime } = require("luxon");

const dt = DateTime.local(2022, 9);

console.log(dt.startOf("month").weekday, dt.daysInMonth);
