import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getCourseToEdit,
  getUpdateCourseStatus,
  updateCourse,
  uploadImage,
  cleanCourseUpdatedMessage,
  fetchCourses,
  getUploadUserImageStatus,
  cleanUploadImageStatus,
  getLoggedUserData,
  fetchMentorCourses,
  userToken,
  getUserToken,
  reLoginUser,
  setUserToken,
} from "../../features/eLearningSlice";
import {
  Button,
  ButtonGroup,
  Card,
  CardMedia,
  Grid,
  Icon,
  Typography,
} from "@mui/material";
import TextFieldsGenerator from "../utils/TextFieldsGenerator";
import SelectComponent from "../utils/SelectComponent";
import ImagePlaceholder from "../../assets/imagePlaceholder.png";
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
    [theme.breakpoints.only("xs")]: {
      marginTop: "5px",
    },
  },
  userImagePlaceholder: {
    width: 200,
    height: 200,
    marginTop: "40px",
    marginBottom: "20px",
    margin: "0 auto",
    [theme.breakpoints.only("xs")]: {
      margin: "0 auto",
      marginTop: "20px",
      marginBottom: "5px",
      width: 200,
      height: 200,
    },
  },
  selectFields: {
    height: "60px",
    borderStyle: "solid",
    borderColor: "grey",
    borderWidth: "1px",
  },
  buttonContainer: {
    marginTop: "20px",
    [theme.breakpoints.only("xs")]: {
      display: "none",
    },
  },
  buttonContainerForSmallScreens: {
    marginTop: "5px",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  titleContainer: {
    backgroundColor: "lightblue",
    minHeight: "50px",
    marginBottom: "20px",
  },
  title: {
    textAlign: "center",
    paddingTop: "5px",
    paddingBottom: "5px",
    color: "white",
  },
  durationLabel: {
    marginBottom: "0",
  },
  saveButton: {
    marginRight: "10px !important",
  },
}));

const EditCourse = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const courseToEdit = useSelector(getCourseToEdit);
  const updateCourseStatus = useSelector(getUpdateCourseStatus);
  const uploadImageStatus = useSelector(getUploadUserImageStatus);
  const loggedUser = useSelector(getLoggedUserData);
  const token = useSelector(getUserToken);
  const classes = useStyles();

  useEffect(() => {
    if (Object.keys(loggedUser).length === 0) {
      navigate("/dashboard");
    }

    if (updateCourseStatus?.message) {
      if (loggedUser.user.role === "mentor") {
        const courses = {
          mentorId: loggedUser.user._id,
          firstItem: 0,
          lastItem: 12,
          page: 1,
        };
        dispatch(cleanCourseUpdatedMessage());
        dispatch(cleanUploadImageStatus());
        dispatch(fetchMentorCourses(courses));
        navigate("/dashboard");
        return;
      }

      const course = {
        filterTerm: "",
        filterLevel: "",
        filterDuration: "",
        page: 1,
        firstValue: 1,
        lastValue: 12,
      };

      dispatch(fetchCourses(course));
      dispatch(cleanCourseUpdatedMessage());
      dispatch(cleanUploadImageStatus());
      if (loggedUser.user.role !== "admin") {
        navigate("/courses");
      } else {
        navigate("/admin/courses");
      }
    }
  }, [updateCourseStatus]);

  const { title, level, description, duration } = courseToEdit;

  const [values, setValues] = useState({
    title: title,
    description: description,
    level: level,
    duration: duration,
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
  const types = ["text", "text"];

  const clickSubmit = () => {
    const course = {
      param: courseToEdit._id,
      data: {
        courseImage: uploadImageStatus.imageUrl,
        ...values,
      },
    };
    dispatch(updateCourse(course));
  };

  const cancel = () => {
    if (loggedUser.user.role === "admin") {
      navigate("/admin/courses");
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
      `courseImage${courseToEdit._id}-${Date.now()}.${
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
      <div className={classes.titleContainer}>
        <h2 className={classes.title}>Edit</h2>
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
            selectedValue={values.level || ""}
            array={levels}
            handleChange={handleChange("level")}
            className={classes.selectFields}
          />
          <ButtonGroup className={classes.buttonContainer}>
            <Button
              variant="contained"
              className={classes.saveButton}
              onClick={clickSubmit}
            >
              Save
            </Button>
            <Button variant="contained" onClick={cancel}>
              Cancel
            </Button>
          </ButtonGroup>
          {
            //display error returned from server
            updateCourseStatus?.error && (
              <Typography component="p" color="error">
                <Icon color="error" className={classes.error}></Icon>
                {updateCourseStatus.error}
              </Typography>
            )
          }
        </Grid>

        <Grid item xs={12} md={6} lg={6} xl={6}>
          <p className={classes.durationLabel}>Duration</p>
          <SelectComponent
            selectedValue={values.duration || ""}
            array={durations}
            handleChange={handleChange("duration")}
            className={classes.selectFields}
          />

          <CardMedia
            className={classes.userImagePlaceholder}
            src={
              uploadImageStatus?.message
                ? uploadImageStatus.imageUrl
                : courseToEdit.courseImage !== ""
                ? courseToEdit.courseImage
                : ImagePlaceholder
            }
            component="img"
          ></CardMedia>
          <Button variant="contained" onClick={uploadPhoto}>
            Upload photo
          </Button>
        </Grid>
      </Grid>
    </Card>
  );
};

export default EditCourse;
