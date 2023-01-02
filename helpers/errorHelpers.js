//#region dependency
const { v4: uuid } = require("uuid");
const { StatusCodes } = require("http-status-codes");
const logRepo = require("../repo/logRepo");
//#endregion

let errorHelpers = {
  logErrorsToConsole: function (err, req, res, next) {
    console.error(
      "Log Entry: " + JSON.stringify(errorHelpers.errorBuilder(err))
    );
    console.error("*".repeat(80));
    next(err);
  },
  logErrorsToFile: function(err,req,res,next){
    let errorObject = errorHelpers.errorBuilder(err);
    errorObject.requestInfo = {
        hostname: req.hostname,
        path: req.path,
        app: req.app
    }
    logRepo.write(errorObject,function(data){
      //  console.log(data);
    },function(err){
      //  console.error(err);
    });
    next(err)
  },
  clientErrorHandler: function (err, req, res, next) {
    if (req.xhr) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        statustext: "issue completing the request",
        message: "XMLHttpRequest error",
        ref: uuid(),
        error: {
          errno: 0,
          call: "XMLHttpRequest Call",
          code: StatusCodes.INTERNAL_SERVER_ERROR,
          message: "XMLHttpRequest error",
        },
      });
    } else {
      next(err);
    }
  },
  errorHandler: function (err, req, res, next) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorHelpers.errorBuilder(err));
  },
  errorBuilder:function(err){
     return {
       status: StatusCodes.INTERNAL_SERVER_ERROR,
       statustext: "issue completing the request",
       message: err.message,
       ref: uuid(),
       error: {
         errno: err.errno,
         call: err.syscall,
         code: StatusCodes.INTERNAL_SERVER_ERROR,
         message: err.message,
       }
     };
  }
};

module.exports = errorHelpers;
