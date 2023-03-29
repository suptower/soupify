const fs = require('fs');
const execSync = require('child_process').execSync;
const dateTime = new Date();
const day = dateTime.getDate();

let dayString = day.toString();
if (day == 1) {
	dayString += 'st';
}
else if (day == 2) {
	dayString += 'nd';
}
else if (day == 3) {
	dayString += 'rd';
}
else {
	dayString += 'th';
}

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const monthString = months[dateTime.getMonth()];

const yearString = dateTime.getFullYear().toString();

const output = 'Updated on ' + dayString + ' of ' + monthString + ', ' + yearString + '.';
console.log(output);

fs.readFile('./package.json', (err, data) => {
	if (err) throw err;

	let packageJsonObj = JSON.parse(data);
	packageJsonObj.date = output;
	packageJsonObj = JSON.stringify(packageJsonObj, null, '\t');

	fs.writeFile('./package.json', packageJsonObj, (err) => {
		if (err) throw err;
		console.log('Date in package.json has been updated.');
	});
});

execSync('npm version patch --no-git-tag-version');