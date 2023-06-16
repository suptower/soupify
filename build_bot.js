const fs = require("fs");
const exec = require("child_process").exec;
const dateTime = new Date();
const day = dateTime.getDate();

let dayString = day.toString();
if (day === 1) {
  dayString += "st";
} else if (day === 2) {
  dayString += "nd";
} else if (day === 3) {
  dayString += "rd";
} else {
  dayString += "th";
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const monthString = months[dateTime.getMonth()];

const yearString = dateTime.getFullYear().toString();

const output = "Updated on " + dayString + " of " + monthString + ", " + yearString + ".";
console.log(output);

function updatePackageJson() {
  fs.readFile("./package.json", (err, data) => {
    if (err) throw err;

    let packageJsonObj = JSON.parse(data);
    packageJsonObj.date = output;
    packageJsonObj = JSON.stringify(packageJsonObj, null, "\t");

    fs.writeFile("./package.json", packageJsonObj, err => {
      if (err) throw err;
      console.log("Date in package.json has been updated.");
    });
  });
}

function commit() {
  updatePackageJson(function () {
    if (process.argv.length < 3) {
      exec("npm version patch --no-git-tag-version && git add . && git commit && git push origin");
    } else {
      let gitcom = "";
      for (const val of process.argv) {
        if (val !== process.argv[0] && val !== process.argv[1]) {
          gitcom += val + " ";
        }
      }
      exec('npm version patch --no-git-tag-version && git add . && git commit -m "' + gitcom + '" && git push origin');
    }
  });
}

updatePackageJson();
//commit();
