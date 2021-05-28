//import the required modules
var express = require('express')
var router = express.Router()
var JSController = require('../controllers/JobSeekerController')
var JAController = require('../controllers/JobAppliedController')
const checkAuth = require("../middleware/check_auth")

router.route('/user/signup').post( JSController.SignUp )
router.route('/user/login').post( JSController.Login )
router.route('/user/profile').get( checkAuth, JSController.getUser)
router.route('/user/update').patch( checkAuth, JSController.updateFields)
router.route('/').get( JSController.listJobs)
router.route('/user/getjob').get( checkAuth, JSController.getJob)
router.route('/user/searchjobs').get( checkAuth, JSController.searchJobs)
router.route('/user/applyjob').post( checkAuth, JSController.applyJob)
router.route('/user/signout').post( checkAuth, JSController.SignOut)
router.route('/user/myapplications').get( checkAuth, JSController.myapplications)
router.route('/user/checkApplication').get( checkAuth, JAController.getApplication)
router.route('/user/deleteApplication').delete( checkAuth, JSController.deleteJobApplication)
router.route('/user/deleteAccount').delete(checkAuth, JSController.deleteAccount)
//deleteAccount
module.exports = router