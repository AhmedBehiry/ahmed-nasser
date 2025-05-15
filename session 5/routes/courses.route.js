const express = require('express')
const {body} = require('express-validator')
const router = express.Router()
const courseController = require ('../controllers/course.controller')
const verfiyToken = require('../middleware/verfiytoken')
const userRoles = require('../utils/userRoles');
const allowedTo = require('../middleware/allowedTo')

router.route('/')
    .get( courseController.getAllCourses )
    .post(
    [ body('name')
        .notEmpty()
        .isLength({min : 5})
        .withMessage('title is required'),
    body('price')
        .notEmpty()
        .withMessage('price is required')
] ,verfiyToken, courseController.addCourse)

router.route('/:courseId')
    .get(courseController.getCourse )
    .patch(verfiyToken,courseController.updateCourse)
    .delete(verfiyToken, allowedTo(userRoles.ADMIN,userRoles.MANGER),courseController.deleteCourse )
    

module.exports = router;






