const fs = require("fs");
// const exec = require("child_process").exec;
const dateTime = new Date();
const day = dateTime.getDate();

let dayString = day.toString();
const lastDigit = dayString.charAt(dayString.length - 1);
if (dayString === "11" || dayString === "12" || dayString === "13") {
  dayString += "th";
} else if (lastDigit === "1") {
  dayString += "st";
} else if (lastDigit === "2") {
  dayString += "nd";
} else if (lastDigit === "3") {
  dayString += "rd";
} else {
  dayString += "th";
}

const months = [
  "January",
  "Febuary",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "November",
  "December",
];

const monthString = months[dateTime.getMonth()];

const yearString = dateTime.getFullYear().toString();

const dateString = "Updated on " + dayString + " of " + monthString + " " + yearString + ".";

function updatePackageJson() {
  fs.readFile("./package.json", (err, data) => {
    if (err) throw err;

    let packageJsonObj = JSON.parse(data);
    packageJsonObj.date = dateString;
    packageJsonObj = JSON.stringify(packageJsonObj, null, "\t");

    fs.writeFile("./package.json", packageJsonObj, err => {
      if (err) throw err;
      console.log("Date in package.json has been updated.");
    });
  });
}

updatePackageJson();

/*
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


//commit(); */
