// Importing necessary Libraries
const mongoose = require('mongoose')

var JobSeekerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true, // no email will repeat now.
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: Number
    },
    address: {
        type: String
    },
    portfolio: {
        type: String
    },
    status: {
        type: String
    },
    gender: {
        type: String
    },
    dob: {
        type: Date
    },
    skills: {
        type: Array
    },
    education: {
        type: Array
    },
    experience: {
        type: Array
    },
    achievements: {
        type: Array
    },    
    jobprofilewanted: {
        type: String
    },
    currentJob: {
        type: String
    },
    currentCompany: {
        type: String
    },
    featured: {
        type: String
    },
    employee_created: {
        type: Date,
        default: Date.now()
    },
    last_updated: {
        type: Date
    }

})

const JobSeeker = mongoose.model('JobSeeker', JobSeekerSchema) // model

module.exports = JobSeeker