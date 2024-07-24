import express from "express";
import courseCtrl from "../controllers/course.controller";

const router = express.Router();

router
  .route("/api/courses")
  .post(courseCtrl.createCourse)
  .get(courseCtrl.getCourses);

router
  .route("/api/course/:courseId")
  .get(courseCtrl.getCourse)
  .put(courseCtrl.updateCourse)
  .delete(courseCtrl.removeCourse);

router.param("courseId", courseCtrl.courseByID);

export default router;
