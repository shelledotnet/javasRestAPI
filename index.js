//#region dependency
require("dotenv").config(); //accessing the environment variables
const express = require("express");
 const pieRepo = require("./repo/pieRepo")
const PORT = process.env.PORT || 4500;
const app = express();
const { v4: uuid } = require("uuid");
const { StatusCodes } = require("http-status-codes");
const cors = require("cors");
// const default404 = require("./middleware/default404");
// const errorHandler = require("./middleware/errorHandler");
// const auditLog = require("./middleware/auditLog");
// const requestHeader = require("./requestHeader");
// const responseHeader = require("./responseHeader");
// const logger = require("./logger");
const chalk = require("chalk");
const morgan = require("morgan");
const errorHelpers = require("./helpers/errorHelpers");
// const feedPostRoute = require("./Route/FeedPostRoute");
// const studentRoute = require("./Route/StudentRoute");
// const appleRoute = require("./Route/AppleRoute");
//#endregion

//#region Immemory-Data-Object
//let fruits = pieRepo.get();
//#endregion

//#region Middlewear
//Configure middleware to support this allow JSON data parsing in request object
app.use(express.json());

//configure CORS
app.use(cors());
//Use the express Router Object
let router = express.Router();

//Create Get to return a list of all pies
router.get('/',function (req,res,next){
    
    pieRepo.get(function (data) {
      data.push({ id: 6, name: "Carrot" });
      return res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        statustext: "OK",
        message: "all fruits re-trived",
        ref: uuid(),
        count: data.length,
        data: data,
      });
    },function(err){
        next(err);
    });
});
  router.get("/search", function (req, res, next) {
    let searchObject = {
      id: req.query.id,
      name: req.query.name,
    };

    pieRepo.search(
      searchObject,
      function (data) {
        return res.status(StatusCodes.OK).json({
          status: StatusCodes.OK,
          statustext: "OK",
          message: "fruit re-trieved successfully",
          ref: uuid(),
          count: data.length,
          data: data,
        });
      },
      function (err) {
        next(err);
      }
    );
  });
 router.get("/:id", function (req, res, next) {
   pieRepo.getById(
     req.params.id,
     function (data) {
       if (data) {
         return res.status(StatusCodes.OK).json({
           status: StatusCodes.OK,
           statustext: "OK",
           message: "single fruit re-trieved successfully",
           ref: uuid(),
           count: data.length,
           data: data,
         });
       } else {
         return res.status(StatusCodes.NOT_FOUND).json({
           status: StatusCodes.NOT_FOUND,
           statustext: "not found",
           message: `fruit with id ${req.params.id} doesn't exist`,
           ref: uuid(),
           //count: data.length,
           error: {
             code: StatusCodes.NOT_FOUND,
             message: `fruit with id ${req.params.id} doesn't exist`
           },
         });
       }
     },
     function (err) {
       next(err);
     }
   );
 });
router.post("/", function (req, res, next) {
  pieRepo.insert(req.body,function (data) {
        return res.status(StatusCodes.CREATED).json({
          status: StatusCodes.CREATED,
          statustext: "created",
          message: "New Pie Added",
          ref: uuid(),
          count: data.length,
          data: data,
        });
      } ,
    function (err) {
      next(err);
    }
  );
});
router.put("/:id", function (req, res, next) {
  pieRepo.getById(req.params.id,function(data){
    if(data){
        //attempt to update the data
pieRepo.update(
    req.body,req.params.id,
    function (data) {
      return res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        statustext: "updated",
        message: `pie ${req.params.id} updated`,
        ref: uuid(),
        count: data.length,
        data: data,
      });
    }
  );
    }
    else{
        return res.status(StatusCodes.NOT_FOUND).json({
          status: StatusCodes.NOT_FOUND,
          statustext: "not found",
          message: `fruit with id ${req.params.id} doesn't exist`,
          ref: uuid(),
          //count: data.length,
          error: {
            code: StatusCodes.NOT_FOUND,
            message: `fruit with id ${req.params.id} doesn't exist`,
          },
        });
    }
  },function(err){
    next(err);
  })
  
});
 router.delete("/:id", function (req, res, next) {
   pieRepo.getById(
     req.params.id,
     function (data) {
       if (data) {
        //Attempt to delete data
         pieRepo.delete(req.params.id,function(data){
            return res.status(StatusCodes.OK).json({
              status: StatusCodes.OK,
              statustext: "OK",
              message: `fruit with id ${req.params.id} is deleted`,
              ref: uuid(),
              count: data.length,
              data: `fruit with id ${req.params.id}  deleted`,
            });
         })
       } else {
         return res.status(StatusCodes.NOT_FOUND).json({
           status: StatusCodes.NOT_FOUND,
           statustext: "not found",
           message: `fruit with id ${req.params.id} doesn't exist`,
           ref: uuid(),
           //count: data.length,
           error: {
             code: StatusCodes.NOT_FOUND,
             message: `fruit with id ${req.params.id} doesn't exist`,
           },
         });
       }
     },
     function (err) {
       next(err);
     }
   );
 });

 router.patch("/:id", function (req, res, next) {
   pieRepo.getById(
     req.params.id,
     function (data) {
       if (data) {
         //attempt to update the data
         pieRepo.patch(req.body, req.params.id, function (data) {
           return res.status(StatusCodes.OK).json({
             status: StatusCodes.OK,
             statustext: "ok",
             message: `pie ${req.params.id} patched`,
             ref: uuid(),
             count: data.length,
             data: data,
           });
         });
       } else {
         return res.status(StatusCodes.NOT_FOUND).json({
           status: StatusCodes.NOT_FOUND,
           statustext: "not found",
           message: `fruit with id ${req.params.id} doesn't exist`,
           ref: uuid(),
           //count: data.length,
           error: {
             code: StatusCodes.NOT_FOUND,
             message: `fruit with id ${req.params.id} doesn't exist`,
           },
         });
       }
     },
     function (err) {
       next(err);
     }
   );
 });



//configure router so all prefixed with /api/v1
app.use('/api/',router);
//Configure exception logger to console
app.use(errorHelpers.logErrorsToConsole);
//Configure exception logger to file
app.use(errorHelpers.logErrorsToFile);
//Configure client error handler
app.use(errorHelpers.clientErrorHandler);
//configure catch all exception middlewear last
app.use(errorHelpers.errorHandler);

//create server to listen on port 3500
app.listen(PORT, () => console.log(chalk.redBright(`server running  at ${PORT}...`)));
//#endregion-