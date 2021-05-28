const express = require('express')
const mongoose = require('mongoose')

require('dotenv').config()
const url  = process.env.MONGODB_URI || 'mongodb://localhost/job-portal'


const app = express()

//routers

app.use(express.json());
app.use(express.urlencoded());

const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    family: 4 // Use IPv4, skip trying IPv6
  };
mongoose.connect(url, options)

const connect = mongoose.connection

connect.on('open', () => {
    console.log('connected...')
})
const jobsSeekerRouter = require('./api/routes/JobsSeekerRoute')
const jobsRecruiterRouter = require('./api/routes/JobsRecruiterRoute')
app.use('/api',jobsSeekerRouter,jobsRecruiterRouter)
port = process.env.PORT || 9000
app.listen(port, () => {
    console.log('server started...')
})