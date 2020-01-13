const path = require('path');
const fs = require('fs');
var moment = require('moment');

//joining path of directory 
const directoryPath = process.argv[2]; // first passed-in arg

//passsing directoryPath and callback function
fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 

    //listing all files using forEach
    files.forEach(function (file) {
	let filePath = path.join(directoryPath, file);

	 fs.stat(filePath, function(err, stats) {
 	    if (err) {
	        return console.log('Unable to stat file: ' + err);
	    } 

	 	if(stats.isDirectory()) {
	 		// get each photo in dir, and if it is COVER, rename to dirname + '.jpg'
	 		fs.readdirSync(filePath, function(err, files) {
		 	    if (err) {
	       			return console.log('Unable to scan directory: ' + err);
	    		} 

	 			files.forEach (file => {
	 				if(file.contains('COVER')) {
	 					let oldPath = path.join(filePath, file);
	 					let newPath = filePath + '.jpg';
	 					fs.renameSync(oldPath, newPath);
	 					moveToMonth(newPath);
	 				}
	 			});
	 		});

	 		// if this isn't a portrait directory, we'll leave it alone
			if(files.length <= 1) {
				fs.rmDir(filePath);
			}
	 	} else {
	 		moveToMonth(filePath);
	 	}
	  });  
    });
});

function moveToMonth(filePath) {
	let match = filePath.match(/_\d{7}_/);
	if(!match.length) return;

	let dateString = match[0]substr(1, 8);
	let date = moment(dateString);

	let monthDir = path.join(directoryPath, date.format("MM - MMMM"));
	if(!fs.existsSync(monthDir)) {
		// TODO problems with async fn calling this
		fs.mkdir('/tmp/a/apple', { recursive: true }, (err) => {
		  if (err) throw err;
		});
	}
}


/**

for each dir/file

- if folder, rename photo inside folder that contains COVER to correct format, 
move it to the correct month
	- delete folder, if 0 or 1 remaining photos
- if file, move to correct folder


*/

