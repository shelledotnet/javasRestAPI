let fs = require("fs");
const FILE_NAME = "./assets/pie2.json";
let pieRepo = {
  get: function (resolve, reject) {
    fs.readFile(FILE_NAME, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data));
      }
    });
  },
  getById: function (id, resolve, reject) {
    fs.readFile(FILE_NAME, function (err, data) {
      if (err) {
        reject(err);
      } else {
        let pie = JSON.parse(data).find((p) => p.id == id);
        resolve(pie);
      }
    });
  },
  search: function (searchObject, resolve, reject) {
    fs.readFile(FILE_NAME, function (err, data) {
      if (err) {
        reject(err);
      } else {
        let pies = JSON.parse(data);
        //perform search
        if (searchObject) {
          //Example search object
          //let searchObject = {
          // "id" : 1,
          // "name" : 'A'
          //};
        }
        pies = pies.filter(
          (p) =>
            (searchObject.id ? p.id == searchObject.id : true) &&
            (searchObject.name
              ? p.name.toLowerCase().indexOf(searchObject.name.toLowerCase()) >=
                0
              : true)
        );
        resolve(pies);
      }
    });
  },
  insert: function (newData, resolve, reject) {
    fs.readFile(FILE_NAME, function (err, data) {
      if (err) {
        reject(err);
      } else {
        let pies = JSON.parse(data);
        let realData = {
          id: pies[pies.length - 1].id + 1,
          name: newData.name,
          wholePrice: newData.wholePrice,
          slicePrice: newData.slicePrice,
          sliceCalories: newData.sliceCalories,
          imageUrl: newData.imageUrl,
        };
        pies.push(realData);
        fs.writeFile(FILE_NAME, JSON.stringify(pies), function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(realData);
          }
        });
      }
    });
  },
  update: function (newData, id, resolve, reject) {
    fs.readFile(FILE_NAME, function (err, data) {
      if (err) {
        reject(err);
      } else {
        let pies = JSON.parse(data);
        let pie = pies.find((p) => p.id == id);

        if (pie) {
          let realData = {
            id: pie.id,
            name: newData.name,
            wholePrice: newData.wholePrice,
            slicePrice: newData.slicePrice,
            sliceCalories: newData.sliceCalories,
            imageUrl: newData.imageUrl,
          };
          Object.assign(pie, realData);
          fs.writeFile(FILE_NAME, JSON.stringify(pies), function (err) {
            if (err) {
              reject(err);
            } else {
              resolve(realData);
            }
          });
        }
      }
    });
  },
  patch: function (newData, id, resolve, reject) {
    fs.readFile(FILE_NAME, function (err, data) {
      if (err) {
        reject(err);
      } else {
        let pies = JSON.parse(data);
        let pie = pies.find((p) => p.id == id);

        if (pie) {
          Object.assign(pie, newData);
          fs.writeFile(FILE_NAME, JSON.stringify(pies), function (err) {
            if (err) {
              reject(err);
            } else {
              resolve(newData);
            }
          });
        }
      }
    });
  },
  delete: function (id, resolve, reject) {
    fs.readFile(FILE_NAME, function (err, data) {
      if (err) {
        reject(err);
      } else {
        let pies = JSON.parse(data);
        let index = pies.findIndex((p) => p.id == id);
        if (index != -1) {
          pies.splice(index, 1);
          fs.writeFile(FILE_NAME, JSON.stringify(pies), function (err) {
            if (err) {
              reject(err);
            } else {
              resolve(index);
            }
          });
        }
      }
    });
  },
};

module.exports = pieRepo;
