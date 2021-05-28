//import the required modules
var express = require('express')
var router = express.Router()
var JRController = require('../controllers/JobRecruiterController')
var JobsController = require('../controllers/JobsController')
var JAController = require('../controllers/JobAppliedController')
const checkAuth = require("../middleware/check_auth")

router.route('/recruiter/signup').post(JRController.SignUp)
router.route('/recruiter/login').post(JRController.Login)
router.route('/recruiter/profile').get( checkAuth, JRController.getUser)
router.route('/recruiter/update').patch( checkAuth, JRController.updateFields)
router.route('/recruiter/postjob').post( checkAuth, JobsController.PostJob)
router.route('/recruiter/accept').patch( checkAuth, JAController.accept)
router.route('/recruiter/reject').patch( checkAuth, JAController.reject)
router.route('/recruiter/acceptAndClose').patch( checkAuth, JAController.accept_closeJob)
router.route('/recruiter/candidates').get( checkAuth, JRController.listCandidates)
router.route('/recruiter/signout').post( checkAuth, JRController.SignOut)
router.route('/recruiter/postedjobs').get( checkAuth, JRController.postedJobs)
router.route('/recruiter/getCandidate').get( checkAuth, JRController.getCandidate)
router.route('/user/deleteAccount').delete(checkAuth, JRController.deleteAccount)
//accept_closeJob
module.exports = router