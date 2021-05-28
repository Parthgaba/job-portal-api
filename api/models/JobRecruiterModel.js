// Importing necessary Libraries
const mongoose = require('mongoose')

const JobsRecruiterSchema = mongoose.Schema({
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
    currentlyHiring: {
        type: Boolean
    },
    gender: {
        type: String
    },
    currentJob: {
        type: String
    },
    totalJobsPosted: {
        type: Number
    },
    currentCompany: {
        type: String
    },
    employer_created: {
        type: Date,
        default: Date.now()
    },
    last_updated: {
        type: Date
    }

})

const JobsRecruiter = mongoose.model('JobsRecruiter', JobsRecruiterSchema ) // model

module.exports = JobsRecruiter