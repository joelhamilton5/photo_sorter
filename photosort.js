const path = require('path');
const fs = require('fs');
var moment = require('moment');

let directoryPath = process.argv[2]; // first passed-in arg
let files = fs.readdirSync(directoryPath);

files.forEach(file => {
	let filePath = path.join(directoryPath, file);
	let stats = fs.statSync(filePath);

	if(stats.isDirectory()) {
		if(!filePath.toUpperCase().includes("IMG")) return;

		let dirFiles = fs.readdirSync(filePath);

        // covers are the google portrait-mode blurred version
		let covers = dirFiles.filter(dirFile => dirFile.includes('COVER'));

		if(covers.length === 1) { // only one cover, we'll save it
			let oldPath = path.join(filePath, covers[0]);
            
            // rename to the folder name (will end up in parent dir)
			let newPath = filePath + '.jpg';
			fs.renameSync(oldPath, newPath);
			fs.rmdirSync(filePath, {recursive: true});
			moveToMonth(newPath);
		} else if (!dirFiles.length) { // multiple covers, choose manually
			fs.rmdirSync(filePath, {recursive: true});
		}
	} else {
		moveToMonth(filePath);
	}
});

function moveToMonth(filePath) {
	let match = filePath.match(/[_-]\d{8}[_-]/);
	if(!match) {
		console.log("No match on file: " + filePath);
		return;
	}

	let dateString = match[0].substr(1, 8);
	let date = moment(dateString);
	let fileName = path.basename(filePath);

	let monthDir = path.join(directoryPath, date.format("MM - MMMM"));
	if(!fs.existsSync(monthDir)) {
		fs.mkdirSync(monthDir);
	}

	fs.renameSync(filePath, path.join(monthDir, fileName));
}
