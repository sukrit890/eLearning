import _ from "lodash";
import jwtDecode from "jwt-decode";
import Course from "../models/courses.model";
import dbErrorHandlers from "./helpers/dbErrorHandlers";

const createCourse = (req, res) => {
  const course = new Course(req.body);
  course.save((err) => {
    if (err) {
      return res.send({ error: dbErrorHandlers.getErrorMessage(err) });
    }
    return res.send({ message: "Course successfuly created" });
  });
};
const getCourses = (req, res) => {
  // get id to enable filtering of data
  const user = jwtDecode(req.cookies.userJwtToken);

  // filter data - get transactions for last three days
  Course.find({})
    .where("userId")
    .equals(userId)
    // sort data in descending order
    .sort({ created: -1 })
    .exec((err, transactions) => {
      if (err) {
        return res.send({ error: dbErrorHandlers.getErrorMessage(err) });
      }
      res.send({ transactions });
    });
};

const getCourse = (req, res) => {
  res.status(200).json(req.profile);
};
const updateCourse = (req, res, next) => {
  let course = req.course;
  course = _.extend(course, req.body);
  course.updated = Date.now();
  course.save((err) => {
    if (err) {
      return res.send({ error: dbErrorHandlers.getErrorMessage(err) });
    }
    return res.send({ message: "Data updated" });
  });
};

const removeCourse = (req, res, next) => {
  const course = req.profile;
  course.remove((err) => {
    if (err) {
      return res.send({ error: dbErrorHandlers.getErrorMessage(err) });
    }
    res.send({ message: "Course deleted" });
  });
};

const courseByID = (req, res, next, id) => {
  Course.findById(id).exec((err, course) => {
    if (err || !course) {
      return res.send({ error: dbErrorHandlers.getErrorMessage(err) });
    }
    req.course = course;
    next();
  });
};

export default {
  createCourse,
  getCourses,
  updateCourse,
  removeCourse,
  getCourse,
  courseByID,
};
