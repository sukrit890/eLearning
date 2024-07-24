import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import jwtDecode from "jwt-decode";
import {
  uploadImage,
  fetchCourses,
  getUploadUserImageStatus,
  cleanUploadImageStatus,
  getLoggedUserData,
  cleanAddCourseMessage,
  getCreateCourseMessage,
  createCourse,
  fetchMentorCourses,
  incrementNumOfCourses,
  getCoursesDisplayPage,
  setCoursesDisplayPage,
  getUsers,
  getAdminFilters,
  cleanReloginStatus,
  reLoginUser,
  setUserToken,
  getUserToken,
  userToken,
} from "../../features/eLearningSlice";
import { Button, ButtonGroup, Card, CardMedia, Grid } from "@mui/material";
import SelectComponent from "../utils/SelectComponent";
import ImagePlaceholder from "../../assets/imagePlaceholder.png";
import TextFieldsGenerator from "../utils/TextFieldsGenerator";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 600,
    margin: "auto",
    textAlign: "center",
    marginTop: theme.spacing(10),
    paddingBottom: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
  },
  error: {
    verticalAlign: "middle",
    fontSize: "18px",
  },
  tittle: {
    marginTop: theme.spacing(2),
    color: theme.palette.openTitle,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300,
  },
  save: {
    marginBottom: theme.spacing(2),
    minWidth: "120px",
    marginRight: theme.spacing(2),
  },
  cancel: {
    marginBottom: theme.spacing(2),
    minWidth: "120px",
  },
  userImagePlaceholder: {
    width: 130,
    height: 130,
    marginTop: "40px",
    marginBottom: "20px",
    margin: "0 auto",
  },
  uploadPhoto: {
    minWidth: "125px",
  },
  selectFields: {
    height: "60px",
    borderStyle: "solid",
    borderColor: "grey",
    borderWidth: "1px",
  },
  addCourseContainer: {
    backgroundColor: "lightBlue",
    minHeight: "50px",
    marginBottom: "20px",
  },
  addCourseTitle: {
    textAlign: "center",
    paddingTop: "5px",
    paddingBottom: "5px",
    color: "white",
  },
  buttonContainer: { marginTop: "20px" },
  durationSelectFieldLabel: { marginBottom: "0" },
  error: { color: "red" },
}));

const AddCourse = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const addCourseStatus = useSelector(getCreateCourseMessage);
  const uploadImageStatus = useSelector(getUploadUserImageStatus);
  const loggedUser = useSelector(getLoggedUserData);
  const classes = useStyles();
  const allUsers = useSelector(getUsers);
  const token = useSelector(getUserToken);
  const allMentors =
    Object.keys(allUsers).length !== 0
      ? allUsers.data.filter((item) => item.role === "mentor")
      : null;

  let mentors = [];
  if (Object.keys(allUsers).length !== 0) {
    Object.values(allMentors).map((item) => {
      mentors.push(item.firstName + " " + item.lastName);
    });
  }

  useEffect(() => {
    if (Object.keys(loggedUser).length === 0 && !token?.message) {
      dispatch(userToken());
    }

    if (token?.message) {
      dispatch(reLoginUser(jwtDecode(token.message)._id));
      dispatch(setUserToken("user reloged"));
    }

    if (loggedUser?.reloged) {
      dispatch(cleanReloginStatus());
    }

    if (addCourseStatus?.message) {
      if (loggedUser.user.role === "mentor") {
        const courses = {
          status: "active",
          mentorId: loggedUser.user._id,
          firstItem: 0,
          lastItem: 12,
        };
        dispatch(setCoursesDisplayPage(1));
        dispatch(incrementNumOfCourses());
        dispatch(fetchMentorCourses(courses));
        dispatch(cleanAddCourseMessage());
        dispatch(cleanUploadImageStatus());
        navigate("/dashboard");
        return;
      }

      const course = {
        filterTerm: "",
        filterLevel: "",
        filterDuration: "",
        page: 1,
        firstItem: 0,
        lastItem: 12,
      };
      dispatch(incrementNumOfCourses());
      dispatch(setCoursesDisplayPage(1));
      dispatch(fetchCourses(course));
      dispatch(cleanAddCourseMessage());
      dispatch(cleanUploadImageStatus());
      if (loggedUser.user.role === "admin") {
        navigate("/admin/courses");
      } else {
        navigate("/courses");
      }
    }
  }, [addCourseStatus, token, loggedUser]);

  const [values, setValues] = useState({
    title: "",
    description: "",
    level: "",
    duration: "",
    mentor: "",
    error: "",
  });

  const handleChange = (name) => (event) => {
    const course = {
      [name]: event.target.value,
    };
    setValues({
      ...values,
      ...course,
    });
  };

  const courseDataToEdit = ["title", "description"];
  const types = ["text", "text"];
  const levels = ["Beginner Level", "Intermediate Level", "Advanced Level"];
  const durations = [
    "0 - 3 Hours",
    "3 - 6 Hours",
    "6 - 12 Hours",
    "1 - 2 Days",
    "2 - 5 Days",
    "5 - 15 Days",
  ];

  const labels = ["Title", "Description"];

  const clickSubmit = () => {
    if (values.mentor === "" && loggedUser.user.role === "admin") {
      setValues({
        ...values,
        error: "You have to assign a mentor for the course",
      });
      return;
    }

    const course = {
      mentorId:
        loggedUser.user.role === "admin"
          ? allMentors.filter(
              (item) =>
                item.firstName === values.mentor.split(" ")[0] &&
                item.lastName === values.mentor.split(" ")[1]
            )[0]._id
          : loggedUser.user._id,
      courseImage: uploadImageStatus.imageUrl,
      ...values,
    };

    if (course.courseImage) {
      setValues({ ...values, error: "" });
      dispatch(createCourse(course));
    } else {
      setValues({
        ...values,
        error: "You have to upload image for the course!",
      });
    }
  };

  const cancel = () => {
    dispatch(cleanUploadImageStatus());
    if (loggedUser.user.role === "admin") {
      navigate("/courses");
    } else {
      navigate("/dashboard");
    }
  };

  const uploadPhoto = () => {
    document.getElementById("uploadImage").click();
  };

  const handleUpload = (event) => {
    let formData = new FormData();
    formData.append(
      "userImage",
      event.target.files[0],
      `courseImage${loggedUser.courseNum}-${Date.now()}.${
        event.target.files[0].name.split(".")[1]
      }`
    );
    dispatch(uploadImage(formData, { id: "test" }));
  };

  return (
    <Card className={classes.card}>
      <input
        type="file"
        style={{ visibility: "hidden" }}
        id="uploadImage"
        onChange={handleUpload}
      />
      <div className={classes.addCourseContainer}>
        <h2 className={classes.addCourseTitle}>Add Course</h2>
      </div>

      <Grid container justifyContent={"center"} spacing={2}>
        <Grid item xs={12} md={6} lg={6} xl={6}>
          <TextFieldsGenerator
            array={courseDataToEdit}
            handleChange={handleChange}
            values={values}
            value={courseDataToEdit}
            labels={labels}
            types={types}
          />
          Level
          <SelectComponent
            selectedValue={values.level}
            array={levels}
            handleChange={handleChange("level")}
            className={classes.selectFields}
          />
          <ButtonGroup className={classes.buttonContainer}>
            <Button
              variant="contained"
              style={{ marginRight: "10px" }}
              onClick={clickSubmit}
            >
              Save
            </Button>
            <Button variant="contained" onClick={cancel}>
              Cancel
            </Button>
          </ButtonGroup>
        </Grid>

        <Grid item xs={12} md={6} lg={6} xl={6}>
          <p className={classes.durationSelectFieldLabel}>Duration</p>
          <SelectComponent
            selectedValue={values.duration}
            array={durations}
            handleChange={handleChange("duration")}
            className={classes.selectFields}
          />

          {loggedUser?.user && loggedUser.user.role === "admin" ? (
            <>
              <p className={classes.durationSelectFieldLabel}>Mentor</p>
              <SelectComponent
                selectedValue={values.mentor}
                array={mentors}
                handleChange={handleChange("mentor")}
                className={classes.selectFields}
              />
            </>
          ) : null}

          <CardMedia
            className={classes.userImagePlaceholder}
            src={
              uploadImageStatus?.message
                ? uploadImageStatus.imageUrl
                : ImagePlaceholder
            }
            component="img"
          ></CardMedia>
          <Button variant="contained" onClick={uploadPhoto}>
            Upload photo
          </Button>
        </Grid>
        {addCourseStatus?.error || values.error ? (
          <p className={classes.error}>
            {addCourseStatus.error || values.error}
          </p>
        ) : null}
      </Grid>
    </Card>
  );
};

export default AddCourse;
