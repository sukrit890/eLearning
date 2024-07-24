import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import jwtDecode from "jwt-decode";
import {
  fetchMentorCourses,
  getCoursesDisplayPage,
  getLoggedUserData,
  getMentorCourses,
  removeCourse,
  setCoursesDisplayPage,
  setCourseToEdit,
  getDeleteCourseMessage,
  cleanDeleteCourseMessage,
  getCourseDeleteModalStatus,
  setCourseDeleteModal,
  cleanReloginStatus,
  getUserToken,
  reLoginUser,
  userToken,
  setUserToken,
} from "../../features/eLearningSlice";
import {
  Typography,
  Grid,
  Card,
  CardMedia,
  Box,
  Button,
  Tooltip,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import PaginationComponent from "../utils/Pagination";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  selectFields: {
    height: "60px",
    borderStyle: "solid",
    borderColor: "grey",
    borderWidth: "1px",
    marginLeft: "2px",
  },
  tooltips: {
    marginLeft: "20px",
  },
  addCourseButton: {
    marginLeft: "auto !important",
    marginBottom: "20px !important",
    minWidth: "220px",
    marginRight: "10px",
    minHeight: "50px",
    [theme.breakpoints.only("xs")]: {
      margin: "0 auto",
      marginTop: "20px !important",
      marginRight: "10px !important",
    },
  },
  warningIcon: {
    fontSize: "60px",
  },
  mentorCoursesContainer: {
    maxHeight: "60vh",
    overflow: "auto",
    paddingBottom: "20px",
  },
  card: {
    maxWidth: 800,
    margin: "auto",
    textAlign: "center",
    marginTop: theme.spacing(2),
    paddingLeft: theme.spacing(1),
    [theme.breakpoints.only("md")]: {
      maxWidth: 600,
    },
  },
  cardContainer: {
    marginBottom: "20px",
  },
  cardImage: { marginTop: "5px" },
  cardText: { paddingLeft: "10px" },
  cardTitle: {
    fontWeight: "900 !important",
    textAlign: "left",
    marginBottom: "5px !important",
  },
  description: {
    textAlign: "left",
    marginBottom: "35px !important",
  },
  level: {
    textAlign: "left",
    fontWeight: "bolder !important",
  },
  editCourse: {
    marginRight: "10px",
    fontSize: "30px !important",
  },
  deleteCourse: {
    fontSize: "30px !important",
  },
  durationAndLevelTextContainer: {
    fontSize: "12px",
    fontWeight: "bolder",
  },
}));

const MentorCourses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [courseToDelete, setCourseToDelete] = useState({});
  const classes = useStyles();

  const loggedUser = useSelector(getLoggedUserData);
  const page = useSelector(getCoursesDisplayPage);
  const mentorCourses = useSelector(getMentorCourses);
  const courseDeleteModalStatus = useSelector(getCourseDeleteModalStatus);
  const deleteCourseStatus = useSelector(getDeleteCourseMessage);
  const token = useSelector(getUserToken);

  useEffect(() => {
    if (token === "Request failed with status code 401") {
      navigate("/");
    }

    if (
      token?.message &&
      Object.keys(loggedUser).length === 0 &&
      token.length !== 12 &&
      token !== "user reloged"
    ) {
      dispatch(userToken());
    }

    if (token?.message && Object.keys(loggedUser).length === 0) {
      dispatch(reLoginUser(jwtDecode(token.message)._id));
      dispatch(setUserToken("user reloged"));
    }

    if (loggedUser?.relogin) {
      if (loggedUser?.user && loggedUser.user.role === "mentor") {
        const user = {
          mentorId: loggedUser.user._id,
          firstItem: 0,
          lastItem: 12,
        };

        dispatch(fetchMentorCourses(user));
        dispatch(cleanReloginStatus());
      }
    }

    if (deleteCourseStatus?.message) {
      const mentorCourses = {
        mentorId: loggedUser.user._id,
        firstItem: 0,
        lastItem: 12,
      };
      dispatch(fetchMentorCourses(mentorCourses));
      dispatch(cleanDeleteCourseMessage());
      dispatch(setCourseDeleteModal(false));
    }
  }, [deleteCourseStatus]);

  const handlePagination = (event, value) => {
    const mentorCourses = {
      mentorId: loggedUser.user._id,
      firstItem: value * 12 - 12,
      lastItem: value * 12,
    };

    dispatch(setCoursesDisplayPage(value));
    dispatch(fetchMentorCourses(mentorCourses));
  };

  const edit = (id) => {
    dispatch(setCourseToEdit(id));
    navigate("/editCourse");
  };

  const remove = (id) => {
    setCourseToDelete(
      Object.values(mentorCourses.data).filter((item) => item._id === id)
    );
    dispatch(setCourseDeleteModal(true));
  };

  return (
    <Grid
      container
      justifyContent={"center"}
      spacing={2}
      className={classes.container}
    >
      <Grid container>
        <Button
          variant="contained"
          className={classes.addCourseButton}
          onClick={() => navigate("/addCourse")}
        >
          Add Course
        </Button>
      </Grid>

      <Grid item xs={12} md={10} lg={10} xl={9}>
        <Grid container justifyContent={"space-around"}>
          <Grid item xs={12} md={12} lg={12} xl={12}>
            <Grid container justifyContent={"center"}>
              {mentorCourses?.totalNumOfCourses &&
              Math.ceil(mentorCourses.totalNumOfCourses / 12) > 1 ? (
                <PaginationComponent
                  page={page}
                  handleChange={handlePagination}
                  numberOfPages={Math.ceil(
                    mentorCourses.totalNumOfCourses / 12
                  )}
                  numberOfItems={Object.keys(mentorCourses.data).length}
                />
              ) : null}
            </Grid>

            {mentorCourses?.data ? (
              <Box className={classes.mentorCoursesContainer}>
                {_.chain(Object.values(mentorCourses.data))

                  .map((item, index) => (
                    <Card key={index} className={classes.card}>
                      <Grid
                        container
                        justifyContent={"space-around"}
                        className={classes.cardContainer}
                      >
                        <Grid item xs={12} md={3} lg={3} xl={3}>
                          <CardMedia
                            className={classes.cardImage}
                            component={"img"}
                            src={
                              item.courseImage ||
                              "https://media.istockphoto.com/photos/hot-air-balloons-flying-over-the-botan-canyon-in-turkey-picture-id1297349747?b=1&k=20&m=1297349747&s=170667a&w=0&h=oH31fJty_4xWl_JQ4OIQWZKP8C6ji9Mz7L4XmEnbqRU="
                            }
                          ></CardMedia>
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          md={6}
                          lg={6}
                          xl={6}
                          className={classes.cardText}
                        >
                          <Typography
                            variant="h5"
                            className={classes.cardTitle}
                          >
                            {item.title}
                          </Typography>

                          <Typography
                            component={"p"}
                            className={classes.description}
                          >
                            {item.description}
                          </Typography>

                          <span
                            className={classes.durationAndLevelTextContainer}
                          >
                            {`Level: ${item.level} ||`}

                            {` Duration: ${item.duration}`}
                          </span>
                        </Grid>

                        <Grid item xs={12} md={2} xl={2} lg={2}>
                          <Tooltip
                            title="Edit course"
                            className={classes.editCourse}
                          >
                            <EditOutlinedIcon
                              fontSize="small"
                              onClick={() => edit(item._id)}
                            />
                          </Tooltip>

                          <Tooltip
                            title="Delete course"
                            className={classes.deleteCourse}
                          >
                            <DeleteOutlineOutlinedIcon
                              onClick={() => remove(item._id)}
                              fontSize="small"
                            />
                          </Tooltip>
                        </Grid>
                      </Grid>
                    </Card>
                  ))
                  .value()}
              </Box>
            ) : (
              "Loading..."
            )}
          </Grid>
        </Grid>
      </Grid>
      <Dialog open={courseDeleteModalStatus}>
        <DialogTitle>Are you sure you want to delete course?</DialogTitle>
        <DialogContent style={{ textAlign: "center" }}>
          <FontAwesomeIcon
            icon={faTriangleExclamation}
            className={classes.warningIcon}
          />
        </DialogContent>
        <DialogActions>
          <Button
            fullWidth
            color="success"
            autoFocus="autoFocus"
            variant="contained"
            onClick={() => dispatch(setCourseDeleteModal(false))}
          >
            Return back
          </Button>

          <Button
            fullWidth
            color="error"
            autoFocus="autoFocus"
            variant="contained"
            onClick={() => dispatch(removeCourse(courseToDelete[0]._id))}
          >
            Delete course
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default MentorCourses;
