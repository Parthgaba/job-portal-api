# Nodejs Express MongoDB Job-Portal-api

# Environment vars
This project uses the following environment variables:

| Name                          | Description                         | Default Value                                  |
| ----------------------------- | ------------------------------------| -----------------------------------------------|
|bcrypt           | Crypting and Decrypting           | "5.0.1"      |
|dotenv           | ENV VASS           | "10.0.0"      |
|express           | framework           | "4.17.1"      |
|jsonwebtoken           | JWT for authentication          | "8.5.1"      |
|mongodb           | Database           | "3.6.8"      |
|mongoose           | connector of databse           | "5.12.11"      |
|nodemailer           | mailing service           | "6.6.1"      |
 "bcrypt": "^5.0.1",
    "dotenv": "^10.0.0",
    "express": "^4.17.1",
    "jsonwebtoken": "^8.5.1",
    "mongodb": "^3.6.8",
    "mongoose": "^5.12.11",
    "nodemailer": "^6.6.1"


## Project Structure
The folder structure of this app is explained below:

| Name | Description |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| **node_modules**         | Contains all  npm dependencies                                                            |
| **api**                  | Contains  source code that will be compiled for the api                                |
| **api/controllers**      | Controllers define functions to serve various express routes. 
| **api/middlewares**      | Express middlewares which process the incoming requests before handling them down to the routes
| **api/routes**           | Contain all express routes, separated by module/area of application                       
| app.ts         | Entry point to express app                                                               |
| package.json             | Contains npm dependencies as well as [build scripts](#what-if-a-library-isnt-on-definitelytyped)   | tsconfig.json            | Config settings for compiling source code only written in TypeScript    
| tslint.json              | Config settings for TSLint code style checking                                                |

## Building the project
### package.json
```json
{
    {
  "name": "job-portal-api",
  "version": "1.0.0",
  "description": "",
  "main": "app.js",
  "scripts": {
    "start": "nodemon app.js"
  },
  "author": "parthgaba",
  "license": "ISC",
  "dependencies": {
    "bcrypt": "^5.0.1",
    "dotenv": "^10.0.0",
    "express": "^4.17.1",
    "jsonwebtoken": "^8.5.1",
    "mongodb": "^3.6.8",
    "mongoose": "^5.12.11",
    "nodemailer": "^6.6.1"
  },
  "devDependencies": {
    "nodemon": "^2.0.7"
  }
}


```

### Running the build
All the different build steps are orchestrated via [npm scripts](https://docs.npmjs.com/misc/scripts).
Npm scripts basically allow us to call (and chain) terminal commands via npm.

| Npm Script | Description |
| ------------------------- | ------------------------------------------------------------------------------------------------- |
| `node app.js`                   | Runs full build and runs node app.                 |
| `nodemon run start`                   | Run live server (preferable for localhost)      |

### Usability of this Project

1. Home Page
    - All the ‘OPEN’ jobs.

2. Recruiter side:
    - Signup
    - Login
    - Post a job
    - List candidates who applied to a job.
    - Reject or accept a candidate.
    - Accepting a candidate at the end of vacancies available should change the status of job as ‘CLOSED’.
    - Profile
    - update
    - delete account
    - see a candidate
    - See posted Jobs
    
3. Candidate side:
    a. Signup
    b. Login/Logout
    c. List all applied jobs and their status.
    d. Apply to one or more jobs.
    e. Delete a job application.
    f. Delete his/her account.
    g. Search Job (with keywords also..)
    h. Update
    i. Profile



### Usability of this Project

- '/api'-> home page.
- '/api/recruiter/signup'-> recruiter can sign up.
Input
```json
{
  {
    "email":"",
    "firstname":"",
    "lastname":"",
    "password":"",
    "phone":
}
}


```

- '/api/recruiter/login'-> recruiter can log up and takes a token for his/her session.
Input
```json
{
{
    "email":"",
    "password":""
}
}
```

- '/api/recruiter/postjob'-> recruiter can post a job.
```json
{
{
        "id": "",
        "jobtitle":       "",
        "postedby":       "",
        "jobdescription": "",     
        "company":        "",
        "salary_offer":   "",
        "jobstatus":      "",
        "skills":         ["",""],
        "token":          ""
}
}
```

- '/api/recruiter/profile'-> recruiter can see his profile.
```json
{
{
    "email":"",
    "token":""
}
}
```

- '/api/recruiter/update'-> recruiter can update his details.
```json
{
  {     "email": "",
        "firstname":        "", 
        "lastname":         "", 
        "phone":            , 
        "gender":           "", 
        "address":          "", 
        "currentlyhiring":  "", 
        "totalJobsPosted":  ,
        "currentJob":       "", 
        "currentCompany":   "",
        "token": "" }
}
- '/api/recruiter/candidates'-> recruiter can see candidates who applied to his/her job.
```json
{
{
    "email":"",
    "token":"",
    "id"   :"" (JobId)
}
}
```

- '/api/recruiter/accept'-> recruiter can accept a candidate's applcation.
```json
{
{
    "id":"",
    "candidate_mail":"",
    "token:""
}
}
```

- '/api/recruiter/reject'-> recruiter can reject candidate's application.
```json
{
{
    "id":"",
    "candidate_mail":"",
    "token:""
}
}
```

- '/api/recruiter/accept'-> recruiter can sign up.
```json
{
{
    "id":"",
    "candidate_mail":"",
    "token:""
}
}
```


  Specifies  which code file acts as the controller for this endpoint.
- get:

  Specifies the method being requested (GET, PUT, POST, etc.).
- operationId: hello
  
  Specifies the direct method to invoke for this endpoint within the controller/router 
- parameters:
  
   This section defines the parameters of your endpoint. They can be defined as path, query, header, formData, or body.
- definitions:
   
   This section defines the structure of objects used in responses or as parameters.

# Common Issues

## IF server fails
Restart it. :)



  Specifies  which code file acts as the controller for this endpoint.
- get:

  Specifies the method being requested (GET, PUT, POST, etc.).
- operationId: hello
  
  Specifies the direct method to invoke for this endpoint within the controller/router 
- parameters:
  
   This section defines the parameters of your endpoint. They can be defined as path, query, header, formData, or body.
- definitions:
   
   This section defines the structure of objects used in responses or as parameters.

# Common Issues

## IF server fails
Restart it. :)

