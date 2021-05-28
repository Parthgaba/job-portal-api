//Import neccesary Modules

const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const JobsController = require("./JobsController")
const JobsApply = require("./JobAppliedController")
const check_auth = require("../middleware/check_auth")
const JobsApplied = require("../models/JobsAppliedModel")
require("dotenv").config()

var invalidations = {}
const JobSeeker = require("../models/JobSeekerModel")

module.exports.SignUp = (req, res) => {
    //database will automatically checks the uniqueness of the mail.
    //So, we don't have to chk it here separately.
    console.log('started working')
    bcrypt.hash(req.body.password, 10, (_err, hash) => {
        if (_err) {
          return res.status(500).json({
            error: _err
          })
        } else {
          const JSeeker = new JobSeeker({
            _id:              new mongoose.Types.ObjectId(),
            email:            req.body.email,
            password:         hash,
            firstname:        req.body.firstname,
            firstname:         req.body.lastname,
            phone:            req.body.phone,
            employee_created: new Date(),
            updated_at:       new Date(),
          })

          JSeeker
            .save()
            .then(result => {
              console.log(result);
              res.status(201).json({
                success: true,
                message: 'New user Successfully created.'
              });
            })
            .catch(err => {
              console.log(err);
              res.status(500).json({
                error: err
              })
            })
        }
    })
}

module.exports.Login = (req, res) => {
    JobSeeker.find({
        email: req.body.email    
    })
    .exec()
    .then(user => {
        if (user.length < 1){
            return res.status(401).json({
                error: 'User Not Found'
            })
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if(err) 
            { 
                return res.status(401).json({
                    error: 'Failed Login'
                })
            }
            if(result)
             {
                const mToken = jwt.sign({
                    email:  user[0].email,
                    userId: user[0]._id
                }, process.env.JWT_KEY, {
                    expiresIn: "2h"
                })
                return res.status(200).json({
                    success: true,
                    message: 'Successfully login',
                    token: mToken
                })
            }

            res.status(401).json({
                error: 'Failed Login'
            })
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })

}

module.exports.SignOut = (req, res) => {
    JobSeeker.find({
        email: req.body.email    
    })
    .exec()
    .then(user => {
        if (user.length < 1){
            return res.status(401).json({
                error: 'User Not Found'
            })
        } 
        if(invalidations.hasOwnProperty(req.body.token)){
          return res.status(200).json({
            success: false,
            message: 'Already SignOut',
        })
        }
        invalidations[req.body.token] = req.body.email

        return res.status(200).json({
                    success: true,
                    message: 'Successfully SignOut',
                })
        })
      .catch(err => {
        res.status(500).json({
          error: err
        })
      })

}

module.exports.getUser = (req, res) => {
      if(invalidations.hasOwnProperty(req.body.token)){
        return res.status(200).json({
          success: false,
          message: 'Authentication Failed',
      })
    }
    JobSeeker.findOne({ email: req.body.email }, function (error, response) {
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

module.exports.myapplications = (req, res) => {
  JobsApplied.find({ jobAppliedBy: req.body.email}, function (error, response) {
    if (error) {
      console.log("Not Found any applied job");
      return res.json({
          err: error
      })
    }
    else {
      if(response.length == 0){
        res.status(200).json({
          success: true, 
          body:"Not Found any applied job"
      })
      }
      res.status(200).json({
          success: true, 
          body:response
      })
    }
  })

}

module.exports.updateFields = (req, res) => {
    if(invalidations.hasOwnProperty(req.body.token)){
      return res.status(200).json({
        success: false,
        message: 'Authentication Failed',
      })
    }
    JobSeeker.findOneAndUpdate({ email: req.body.email },{ 
      $set: {
        firstname:        req.body.firstname, 
        lastname:         req.body.lastname, 
        phone:            req.body.phone, 
        gender:           req.body.gender, 
        address:          req.body.address, 
        portfolio:        req.body.portfolio, 
        status:           req.body.status, 
        dob:              req.body.dob, 
        skills:           req.body.skills, 
        education:        req.body.education, 
        experience:       req.body.experience, 
        achievements:     req.body.achievements,
        jobprofilewanted: req.body.jobprofilewanted, 
        currentJob:       req.body.currentJob, 
        currentCompany:   req.body.currentCompany, 
        featured:         req.body.featured, 
        updated_at:       new Date()
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
            message: 'Successfully updated user.', 
            body:resJS
        })
      }
    })
  }

module.exports.deleteAccount = (req, res) => {
  if(invalidations.hasOwnProperty(req.body.token)){
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
    JobSeeker.findOne({  _id: decoded.userId }, (error, response) => {
      if (error) {
        return res.json({
            err: error
        });
      }
      else {
          if(response==null) {
              return res.json({error: "No user available."})
          }
          bcrypt.compare(req.body.password, response.password, (err, result) => {
            if(err) 
            { 
                return res.status(401).json({
                    error: 'Password didnot match'
                })
            }
            if(result)
             {
          JobSeeker.remove({  email: req.body.email, _id: decoded.userId }, (error, resRec) => {
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
    }else{
      return res.status(401).json({
        error: 'Failed Deleting Account'
    })
    }
  })
      }
    })
}

module.exports.appliedJobs =  (req, res) => {
  if(invalidations.hasOwnProperty(req.body.token)){
    return res.status(200).json({
      success: false,
      message: 'Authentication Failed',
    })
  }
    //find the first user form the collection
    var decoded = jwt.verify(req.body.token, process.env.JWT_KEY);
   
    JobSeeker.findOne({  _id: decoded.userId }, (error, response) => {
        if (error) {
          return res.json({
              err: error
          });
        }
        else {
            if(response==null) {
                return res.json({error: "No user available."})
            }
            JobsApply.find({  jobAppliedBy: response.email  }, (error, resRec) => {
                if (error) {
                  return res.json({
                      err: error
                  });
                }
                else {
                    if (resRec == null) {
                        return res.json({error: "You haven't applied for any job yet."});
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
module.exports.listJobs = JobsController.listJobs

module.exports.getJob = JobsController.getJob

module.exports.searchJobs = JobsController.searchJobs

module.exports.applyJob = JobsApply.applyJob

module.exports.invalidations = invalidations

module.exports.deleteJobApplication = JobsApply.deleteJobApplication