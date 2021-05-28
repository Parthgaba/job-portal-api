// Importing necessary Libraries
const mongoose = require('mongoose')

const JobsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    jobTitle: {
        type: String,
        required: true
    },
    postedBy: {
        type: String,
        required: true
    },
    jobDescription: {
        type: String
    },
    company: {
        type: String
    },
    skills: {
        type: Array
    },
    salary_offer: {
        type: String
    },
    jobstatus: {
        type: String
    },
    postedAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date
    }

})

const Jobs = mongoose.model('Jobs', JobsSchema) // model

module.exports = Jobs