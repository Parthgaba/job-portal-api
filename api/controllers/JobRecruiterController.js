//Import neccesary Modules

const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const JobsController = require("./JobsController")
const JobsAppliedController = require("./JobAppliedController")
require("dotenv").config()

const JobsRecruiter = require("../models/JobRecruiterModel")
const Jobs = require("../models/JobsModel")
const JobSeeker = require("../models/JobSeekerModel")

var invalidations = {};

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
          const JRecruiter = new JobsRecruiter({
            _id:              new mongoose.Types.ObjectId(),
            email:            req.body.email,
            password:         hash,
            firstname:        req.body.firstname,
            firstname:         req.body.lastname,
            phone:            req.body.phone,
            employer_created: new Date(),
            updated_at:       new Date(),
          })

          JRecruiter
            .save()
            .then(result => {
              console.log(result);
              res.status(201).json({
                success: true,
                message: 'New Recruiter Successfully created.'
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
    JobsRecruiter.find({
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

module.exports.getUser = (req, res) => {
  if(invalidations.hasOwnProperty(req.body.token)){
    return res.status(200).json({
      success: false,
      message: 'Authentication Failed',
  })
  }
    JobsRecruiter.findOne({ email: req.body.email }, function (error, response) {
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

module.exports.getCandidate = (req, res) => {
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

module.exports.updateFields = (req, res) => {
  if(invalidations.hasOwnProperty(req.body.token)){
    return res.status(200).json({
      success: false,
      message: 'Authentication Failed',
  })  
  }
    JobsRecruiter.findOneAndUpdate({ email: req.body.email },{ 
      $set: {
        "firstname":        req.body.firstname, 
        "lastname":         req.body.lastname, 
        "phone":            req.body.phone, 
        "gender":           req.body.gender, 
        "address":          req.body.address, 
        "currentlyhiring":  req.body.currentlyhiring, 
        "totalJobsPosted":  req.body.totalJobsPosted,
        "currentJob":       req.body.currentJob, 
        "currentCompany":   req.body.currentCompany, 
        "updated_at":       new Date()
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
  }var decoded = jwt.verify(req.body.token, process.env.JWT_KEY);
  console.log(decoded.userId)
  JobRecruiter.findOne({  _id: decoded.userId }, (error, response) => {
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
        JobsRecruiter.remove({  email: req.body.email, _id: decoded.userId }, (error, resRec) => {
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


module.exports.SignOut = (req, res) => {
  JobsRecruiter.find({
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

module.exports.postedJobs =  (req, res) => {
  if(invalidations.hasOwnProperty(req.body.token)){
    return res.status(200).json({
      success: false,
      message: 'Authentication Failed',
    })
  }
    //find the first user form the collection
    var decoded = jwt.verify(req.body.token, process.env.JWT_KEY);
    JobsRecruiter.findOne({  _id: decoded.userId }, (error, response) => {
        if (error) {
          return res.json({
              err: error
          });
        }
        else {
            if(response==null) {
                return res.json({error: "No user available."})
            }
            console.log(response.email)
            Jobs.find({  postedBy: response.email  }, (error, resRec) => {
                if (error) {
                  return res.json({
                      err: error
                  });
                }
                else {
                    if (resRec.length == 0) {
                        return res.json({error: "You haven't posted for any job yet."});
                    }
                    res.status(200).json({
                        success: true,
                        body:resRec
                    })
                

            }
        })  
        }
      })
  }

module.exports.listCandidates = JobsAppliedController.listApplicants


module.exports.acceptCandidate = (req, res) => {

}

module.exports.rejectCandidate = (req, res) => {

}

module.exports.invalidations = invalidations
