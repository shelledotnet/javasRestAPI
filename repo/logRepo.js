let fs = require('fs');

const FILE_NAME = './logs/log.txt';

let logRepo = {
    write: function(data,resolve,reject){
        let towrite = "*".repeat(80) + "\r\n";
        towrite += "Date/Time: " + new Date().toLocaleDateString() + "\r\n";
        towrite += "Exception Info: " + JSON.stringify(data) + "\r\n";
        towrite += "*".repeat(80) + "\r\n";

         fs.writeFile(FILE_NAME,towrite,function(err){
            if(err){
                reject(err);
            }
            resolve(data);
         });


    }
};
module.exports = logRepo ;
