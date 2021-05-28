//Import neccesary Modules

const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const JobController = require("./JobsController")
const Jobs = require("../models/JobsModel")
const JobApply = require("../models/JobsAppliedModel")
const { ReplSet } = require("mongodb")
const JobRecruiterController = require("./JobRecruiterController")

module.exports.PostJob = (req, res) =>{
  if(JobRecruiterController.invalidations.hasOwnProperty(req.body.token)){
    return res.status(200).json({
      success: false,
      message: 'Authentication Failed',
  })
  }
    Jobs.findOne({ _id: req.body.id }, function (error, resExist) {
        if (error) {
          return res.json(error)
        }
  
        if(resExist && resExist._id) {
         return res.status(400).json({
            success: false,
            message: 'This job already exists'
        });
        }
    const JobsInstance = new Jobs({
        _id:            new mongoose.Types.ObjectId(),
        jobTitle:       req.body.jobtitle,
        postedBy:       req.body.postedby,
        jobDescription: req.body.jobdescription,     
        company:        req.body.company,
        salary_offer:   req.body.salary_offer,
        jobstatus:      req.body.jobstatus,
        skills:         req.body.skills,
        postedAt:       Date.now(),
        updatedAt:      Date.now()

    })
    JobsInstance
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        success: true,
        message: 'New Job Post Successfully created.'
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    })
  })
}

//export the getAllJob method
module.exports.listJobs =  (req, res) => {
    //find the first user form the collection
    Jobs.find({}, (error, response) => {
      if (error) {
        return res.json({
            err: error
        });
      }
      else {
        var res_ = response.map((response) => {  return{id:response._id,job:response.jobTitle,company:response.company,status:response.jobstatus}})
        console.log(res_)
        res.status(200).json({
            success: true,
            body:res_
        })
      }
    })
  }
  
  //export the getUser by id method
  module.exports.getJob = function (req, res) {
    //find the first user form the collection
    if(req.body.id==null) {
        return res.status(404).json({
            error: "provide id of the job."
        })
    }
    Jobs.findOne({ _id: req.body.id }, function (error, response) {
      if (error) {
        return res.json({
            err: error 
        })
      }
      else {
        res.status(200).json({
            success: true, 
            body:response
        });
      }
    });
  }
  
  //export the searchJob method
  module.exports.searchJobs = function(req,res){
    let conditions = {};
    if(req.body.keyword){
      conditions['$or'] = [{"jobTitle": new RegExp(req.body.keyword,"i")}, {"jobDescription": new RegExp(req.body.keyword,"i")}, {"company": new RegExp(req.body.keyword,"i")}]
    }
  
    if(req.body.skills){
      conditions["skills"] =  { $all: req.body.skills};
    }
  
  
    console.log("conditions",conditions); 
    Jobs.find(conditions,(error,response)=>{
        if(error){
          res.json(error);
        }
        else {
          
            if(response.length>0){
              var res_ = response.map((response) => {  return{id:response._id,job:response.jobTitle,company:response.company,status:response.jobstatus}})
        
                res.status(200).json({
                    success: true, 
                    body:res_
                    })
            }
            else{
                res.status(404).json({
                    success: false,
                    body: "Sorry, no such job found." 
                    })
            }
        }
    })
  }
  
  // export the updateUser method
  module.exports.updateJob =  (req, res) => {
    Jobs.findOneAndUpdate({ _id: req.params.jobId },{ 
      $set: {
        jobTitle:       req.body.jobtitle,
        postedBy:       req.body.postedby,
        jobDescription: req.body.jobdescription,     
        company:        req.body.company,
        salary_offer:   req.body.salary_offer,
        jobstatus:      req.body.jobstatus,
        skills:         req.body.skills,
        updatedAt:      Date.now()
      }
    }, function (error, resultJB) {
      if (error) {
        console.log("In error");
        return res.json(error);
      }
      else {
        console.log("In job update");
        res.status(200).json({
            success: true,
            message: 'Successfully updated job.', 
            body:resultJB});
      }
    });
  }
  
  //export deleteUser method
  exports.deleteJob = function(req, res) {
    Job.remove({ _id: req.params.id }, function(err, job) {
      if (err) {
        console.log("In error");
        return res.json(err);
      }
      else {
        console.log("In delete");
        res.status(200).json({
            success: true, 
            message: 'Job successfully deleted.', 
            body:job
        });
      }
    })
  }
  