const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const JobController = require("./JobsController")
const Jobs = require("../models/JobsModel")
const JobApply = require("../models/JobsAppliedModel")
const { ReplSet } = require("mongodb")
const JobsRecruiter = require("../models/JobRecruiterModel")
const JobSeeker = require("./JobSeekerController")
const JobRecruiterController = require("./JobSeekerController")
const JobSeekerModel = require("../models/JobSeekerModel")
require("dotenv").config()
// export the postUser method
module.exports.applyJob =  (req, res) => {
    // creating the new user
    if(JobSeeker.invalidations.hasOwnProperty(req.body.token)){
      return res.status(200).json({
        success: false,
        message: 'Authentication Failed',
      })
    }
    if (!req.body.jobAppliedId || !req.body.jobAppliedBy) {
      res.status(400).json({
        success: false,
        message: 'Feilds missing'
      });
    } else {
      // Checking job  already exist or not
      jobAppliedId = req.body.jobAppliedId
      jobAppliedBy = req.body.jobAppliedBy
      JobApply.find({ jobAppliedId, jobAppliedBy}, (error, JobExist) =>{
        if (error) {
          return res.json({err:error})
        }
        if (JobExist.length > 0) {
          return res.status(400).json({
            success: false,
            message: 'You have already applied this job.'
          });
        }
        var applying = new JobApply({
            _id:          new mongoose.Types.ObjectId(),
            jobAppliedId: jobAppliedId,
            jobAppliedBy: jobAppliedBy,
            appliedOn: new Date()
        });
  
        // Attempt to creating new userres
        applying.save( (err, result_) => {
          if (err) {
            return res.json({error:err})
          }
          var nodemailer = require('nodemailer');

          var transporter = nodemailer.createTransport({
            service: 'gmail',    
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
              user: 'email@gmail.com',
              pass: 'pass'
            }
          });

          var mailOptions = {
            from: 'email@gmail.com',
            to: req.body.postedBy_mail,  // this req.mail is just for temporary purpose. 
            subject: 'Job Application from someone.',
            text: 'Someone applied on your job post'
          };

          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
          res.status(200).json({
            success: true,
            message: 'Successfully applied this job.',
            body: result_
          });
        });
      });
  
    } // end of save method
  } // end of postUser method


module.exports.getApplication = (req, res) => {
    if(JobSeeker.invalidations.hasOwnProperty(req.body.token)){
      return res.status(200).json({
        success: false,
        message: 'Authentication Failed',
    })
  }
  JobApply.findOne({ _id: req.body.id }, function (error, response) {
    if (error) {
      console.log("Not Found in the DB");
      return res.json({
          err: error
      })
    }
    else {
      res.status(200).json({
          success: true, 
          body:response
      })
    }
  })
}

//export the getAllJob method
module.exports.listApplicants =  (req, res) => {
    //find the first user form the collection
    const JobID = req.body.id 
    Jobs.findOne({  _id: JobID }, (error, response) => {
        if (error) {
          return res.json({
              err: error
          });
        }
        else {
            if(response==null) {
                return res.json({error: "No Job of this id available."})
            }
            JobsRecruiter.findOne({  email: req.body.email  }, (error, resRec) => {
                if (error) {
                  return res.json({
                      err: error
                  });
                }
                else {
                    if (resRec == null) {
                        return res.json({error: "This job is not associated with your account."})
                    }
                    if(response.postedBy == resRec.email){
                        JobApply.find({ jobAppliedId: JobID }, (error, resApplications) => {
                        if (error) {
                            return res.json({
                            err: error
                        });
                        }
                        else {
                            if (resApplications.length == 0) {
                                return res.json({error: "No one yet applied on this job."})
                            }
                            res.status(200).json({
                                success: true,
                                body:resApplications
                        })
                        }
                    })
                }else{
                    res.status(404).json({
                        success: false,
                        body:"you haven't posted this job."
                    })
                }

            }
        })  
        }
      })
  }

  module.exports.accept = (req, res) => {
    if(JobRecruiterController.invalidations.hasOwnProperty(req.body.token)){
      return res.status(200).json({
        success: false,
        message: 'Authentication Failed',
      })
    }
    JobApply.findOneAndUpdate({ _id: req.body.id },{ 
      $set: {
        status: "ACCEPTED"
      }
    }, function (error, resJS) {
      if (error) {
        return res.json({
            err: error
        });
      }
      else {
        res.status(200).json({
            success: true, 
            message: 'Successfully accepted application.', 
            body:resJS
        })
      }
    })
    var nodemailer = require('nodemailer');

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'email@gmail.com',
        pass: 'pass'
      }
    });

    var mailOptions = {
      from: 'email@gmail.com',
      to: req.body.candidate_mail,// this req.mail is just for temporary purpose. 
      subject: 'Job Application Selected',
      text: 'Congrats, You are Selected'
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
  module.exports.accept_closeJob = (req, res) => {
    if(JobRecruiterController.invalidations.hasOwnProperty(req.body.token)){
      return res.status(200).json({
        success: false,
        message: 'Authentication Failed',
      })
    }
    JobApply.findOneAndUpdate({ _id: req.body.id },{ 
      $set: {
        status: "ACCEPTED"
      }
    }, function (error, resJS) {
      if (error) {
        return res.json({
            err: error
        });
      }
      else {
        res.status(200).json({
            success: true, 
            message: 'Successfully accepted application.', 
            body:resJS
        })
      }
    })
    Jobs.findOneAndUpdate({_id: req.body.job_id},{ 
      $set: {
        jobstatus: "CLOSED"
      }
    }, function (error, resJS) {
      if (error) {
        return res.json({
            err: error
        });
      }
      else {
        res.status(200).json({
            success: true, 
            message: 'Successfully accepted application.', 
            body:resJS
        })
      }
    })
    var nodemailer = require('nodemailer');

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'email@gmail.com',
        pass: 'pass'
      }
    });

    var mailOptions = {
      from: 'email@gmail.com',
      to: req.body.candidate_mail,// this req.mail is just for temporary purpose. 
      subject: 'Job Application Selected',
      text: 'Congrats, You are Selected'
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
  
  module.exports.reject = (req, res) => {
    if(JobRecruiterController.invalidations.hasOwnProperty(req.body.token)){
      return res.status(200).json({
        success: false,
        message: 'Authentication Failed',
      })
    }
    JobApply.findOneAndUpdate({ _id: req.body.id },{ 
      $set: {
        status: "REJECTED"
      }
    }, function (error, resJS) {
      if (error) {
        return res.json({
            err: error
        });
      }
      else {
        res.status(200).json({
            success: true, 
            message: 'Successfully rejected application.', 
            body:resJS
        })
      }
    })
    var nodemailer = require('nodemailer');

    var transporter = nodemailer.createTransport({
      service: 'gmail',    
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: 'email@gmail.com',
        pass: 'pass'
      }
    });

    var mailOptions = {
      from: 'email@gmail.com',
      to: req.body.candidate_mail,
      subject: 'Job Application not Selected',
      text: 'Sorry, You are not Selected'
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }

  exports.deleteJobApplication = function(req, res) {
    if(JobSeeker.invalidations.hasOwnProperty(req.body.token)){
      return res.status(200).json({
        success: false,
        message: 'Authentication Failed',
      })
    }
      //find the first user form the collection
      console.log(req.body.token)
      console.log(process.env.JWT_KEY)
      var decoded = jwt.verify(req.body.token, process.env.JWT_KEY);
      console.log(decoded.userId)
      JobSeekerModel.findOne({  _id: decoded.userId }, (error, response) => {
        if (error) {
          return res.json({
              err: error
          });
        }
        else {
            if(response==null) {
                return res.json({error: "No user available."})
            }
            JobApply.remove({  jobAppliedBy: response.email, _id: req.body.id }, (error, resRec) => {
                if (error) {
                  return res.json({
                      err: error
                  });
                }
                else {
                    if (resRec == null) {
                        return res.json({error: "Delete Failed"});
                    }
                    res.status(404).json({
                        success: true,
                        body:resRec
                    })
                

            }
        })  
        }
      })
  }