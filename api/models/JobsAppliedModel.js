// Importing necessary Libraries
const mongoose = require('mongoose')

const JobsAppliedSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    jobAppliedId: {
        type: String,
        required: true
    },
    jobAppliedBy: {
        type: String,
        required: true
    },
    status:{
        type: String,
        default: "submitted"
    },
    appliedOn: {
        type: Date,
        default: Date.now()
    },
})

const JobsApplied = mongoose.model('JobsApplied', JobsAppliedSchema) // model

module.exports = JobsApplied