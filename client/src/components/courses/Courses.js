import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import jwtDecode from "jwt-decode";
import {
  cleanEnrollInCourseMessage,
  cleanReloginStatus,
  cleanUserFetchDataStatus,
  enrollInCourse,
  fetchCourses,
  fetchMentors,
  fetchUserCourses,
  fetchUserData,
  getCourses,
  getCoursesDisplayPage,
  getEnrollInCourseMessage,
  getLoggedUserData,
  getSelectedFilterTerm,
  getStudentFilters,
  getUserToken,
  reLoginUser,
  setCoursesDisplayPage,
  setStudentFilters,
  setUserToken,
  userToken,
  getSelectedDurationFilter,
  getSelectedLevelFilter,
  setLevelFilter,
  setDurationFilter,
} from "../../features/eLearningSlice";
import {
  Typography,
  Grid,
  Card,
  CardMedia,
  Checkbox,
  Button,
  Box,
  FormControlLabel,
  FormControl,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
  CardContent,
  CardHeader,
  Popover,
  CardActions,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import PaginationComponent from "../utils/Pagination";
import MouseOverPopover from "./Popover";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: "50px",
    position: "fixed",
    [theme.breakpoints.only("xs")]: {
      overflowY: "clip",
    },
  },
  filtersToggleButton: {
    marginTop: "50px",
    marginBottom: "20px !important",
    minWidth: "300px !important",
    minHeight: "60px !important",
    [theme.breakpoints.only("xs")]: {
      marginTop: "0px",
      width: "220px",
    },
    [theme.breakpoints.only("md")]: {
      minWidth: "220px !important",
    },
  },
  filterLevels: {
    display: "flex",
    alignItems: "center",
    borderBottomStyle: "solid",
    borderBottomWidth: "1px",
    paddingLeft: "10px",
  },
  filterDurations: {
    display: "flex",
    flexDirection: "row",
    paddingLeft: "10px",
    marginTop: "20px",
  },
  enrolledInCourseMessage: {
    marginTop: "20px",
    color: "red",
    marginBottom: "20px ",
    textAlign: "center",
  },
  displayCoursesContainer: {
    maxHeight: "60vh",
    overflow: "auto",
  },
  paginationContainer: {
    marginBottom: "50px",
  },
  card: {
    maxWidth: 800,
    margin: "auto",
    textAlign: "center",

    [theme.breakpoints.only("md")]: {
      maxWidth: 600,
    },
    [theme.breakpoints.only("xs")]: {
      textAlign: "left",
    },
  },
  title: {
    textAlign: "center",
    marginLeft: "10px",
    [theme.breakpoints.only("xs")]: {
      textAlign: "left",
    },
  },
  enrolledInCourseCardMessage: {
    marginLeft: "5px",
    fontSize: "12px",
  },
  description: {
    textAlign: "left",
    marginLeft: "10px",
    marginTop: "0px",
    [theme.breakpoints.only("xs")]: {
      textAlign: "left",
    },
  },
  duration: {
    display: "inline-flex",
    fontWeight: "bolder",
  },
  level: {
    display: "inline-flex",
    fontWeight: "bolder",
  },
  cardText: {
    // marginBottom: "2px",
  },
  image: {
    maxWidth: "50%",
    height: "5%",
    margin: "auto",
    marginTop: "10px",
    [theme.breakpoints.only("xs")]: {
      marginLeft: "10px",
      maxWidth: "100%",
      height: "2%",
    },
  },
  filterResults: {
    marginTop: "0",
    maxWidth: "320px",
    margin: "0 auto",
    marginBottom: "20px",
  },
  enrollButton: {
    marginBottom: "10px !important",
    marginLeft: "2px !important",
    marginRight: "2px !important",
  },
  styleCard: {
    width: "600px",
    textAlign: "center",

    [theme.breakpoints.only("xs")]: {
      width: "400px",
      textAlign: "left",
      wordWrap: "break-word",
    },
  },
}));

const Courses = () => {
  const courses = useSelector(getCourses);
  const dispatch = useDispatch();
  const classes = useStyles();
  const loggedUser = useSelector(getLoggedUserData);
  const levelFilter = useSelector(getSelectedLevelFilter);
  const durationFilter = useSelector(getSelectedDurationFilter);

  const [courseOverviewModal, setCourseOverviewModal] = useState(false);
  const [courseToDisplay, setCourseToDisplay] = useState([]);
  const page = useSelector(getCoursesDisplayPage);
  const enrollInCourseStatus = useSelector(getEnrollInCourseMessage);
  const navigate = useNavigate();
  const [displayFilters, setDisplayFilters] = useState(false);
  const filterTerm = useSelector(getSelectedFilterTerm);
  const token = useSelector(getUserToken);

  useEffect(() => {
    if (
      token?.message &&
      Object.keys(loggedUser).length === 0 &&
      token.length !== 12 &&
      token !== "user reloged" &&
      loggedUser !== "signout"
    ) {
      dispatch(userToken());
    }

    if (token?.message) {
      dispatch(reLoginUser(jwtDecode(token.message)._id));
      dispatch(setUserToken("user reloged"));
    }

    if (loggedUser?.relogin) {
      if (loggedUser?.user && loggedUser.user.role === "student") {
        const user = {
          userCourses: loggedUser.user.enrolledInCourses,
          param: loggedUser.user._id,
          id: loggedUser.user._id,
          courseId:
            loggedUser.user.enrolledInCourses[
              loggedUser.user.enrolledInCourses.length - 1
            ],
          completedCourses: loggedUser.user.completedCourses,
        };

        dispatch(fetchMentors());

        const courses = {
          firstItem: 0,
          lastItem: 12,
        };

        dispatch(fetchCourses(courses));
        dispatch(cleanReloginStatus());
      }
    }
    if (enrollInCourseStatus?.message) {
      dispatch(fetchMentors());
      dispatch(cleanEnrollInCourseMessage());
      dispatch(setCoursesDisplayPage(1));
    }

    if (Object.keys(courses).length === 0) {
      const courses = {
        firstItem: 0,
        lastItem: 12,
      };

      dispatch(fetchCourses(courses));
    }

    if (loggedUser?.message) {
      const user = {
        userCourses: loggedUser.user.enrolledInCourses,
        param: loggedUser.user._id,
        id: loggedUser.user._id,
        courseId:
          loggedUser.user.enrolledInCourses[
            loggedUser.user.enrolledInCourses.length - 1
          ],
        completedCourses: loggedUser.user.completedCourses,
      };

      dispatch(fetchUserCourses(user));
      dispatch(cleanUserFetchDataStatus());
      navigate("/dashboard");
    }
  }, [enrollInCourseStatus, loggedUser, token]);

  const [filters, setFilters] = useState({
    filterLevel: "",
    filterDuration: "",
  });

  const enroll = (id) => {
    const user = {
      userCourses: loggedUser.user.enrolledInCourses,
      param: loggedUser.user._id,
      id: loggedUser.user._id,
      courseId: id,
      completedCourses: loggedUser.user.completedCourses,
    };

    dispatch(enrollInCourse(user));
    setCourseOverviewModal(false);
    dispatch(fetchUserData(loggedUser.user._id));
  };

  const handleLevelFilter = (name) => (event) => {
    const levels = [
      "Beginner Level",
      "Intermediate Level",
      "Advanced Level",
      "All levels",
    ];

    dispatch(setLevelFilter(levels.indexOf(event.target.name)));

    setFilters({
      ...filters,
      [name]: event.target.name,
    });

    const courses = {
      filterTerm: filterTerm ? filterTerm : undefined,
      filterLevel:
        levelFilter.filter(Boolean).length > 0 ? event.target.name : undefined,
      filterDuration:
        durationFilter.filter(Boolean).length > 0
          ? filters.filterDuration
          : undefined,
      page: 1,
      firstItem: 0,
      lastItem: 12,
    };
    dispatch(setStudentFilters(courses));
    dispatch(setCoursesDisplayPage(1));
    dispatch(fetchCourses(courses));
  };

  const handleDurationFilter = (name) => (event) => {
    let arr = [
      "0 - 3 Hours",
      "3 - 6 Hours",
      "6 - 12 Hours",
      "1 - 2 Days",
      "2 - 5 Days",
      "5 - 15 Days",
    ];

    dispatch(setDurationFilter(arr.indexOf(event.target.name)));

    setFilters({
      ...filters,
      [name]: event.target.name,
      filterByDuration: true,
    });

    const courses = {
      filterTerm: filterTerm ? filterTerm : undefined,
      filterLevel:
        levelFilter.filter(Boolean).length > 0
          ? filters.filterLevel
          : undefined,
      filterDuration:
        durationFilter.filter(Boolean).length > 0
          ? event.target.name
          : undefined,
      page: 1,
      firstItem: 0,
      lastItem: 12,
    };
    dispatch(setStudentFilters(courses));
    dispatch(setCoursesDisplayPage(1));
    dispatch(fetchCourses(courses));
  };

  const filterItems = [
    ["Beginner Level", "Intermediate Level", "Advanced Level", "All levels"],
    [
      "0 - 3 Hours",
      "3 - 6 Hours",
      "6 - 12 Hours",
      "1 - 2 Days",
      "2 - 5 Days",
      "5 - 15 Days",
    ],
  ];

  const handlePagination = (event, value) => {
    const courses = {
      filterLevel: levelFilter.includes(true) ? filters.filterLevel : undefined,
      filterDuration: durationFilter.includes(true)
        ? filters.filterDuration
        : undefined,
      page: value,
      firstItem: value * 12 - 12,
      lastItem: value * 12,
    };

    dispatch(setCoursesDisplayPage(value));
    dispatch(fetchCourses(courses));
  };

  return (
    <>
      <Grid
        container
        spacing={2}
        className={classes.container}
        justifyContent="center"
      >
        <Grid
          item
          xs={12}
          md={12}
          lg={12}
          xl={12}
          style={{ display: "flex", justifyContent: "center" }}
        >
          {filterTerm !== "" ? (
            <Alert
              variant="filled"
              color="info"
              severity="info"
              className={classes.filterResults}
            >
              Number of available courses is courses for requested search term{" "}
              <span
                style={{
                  fontWeight: "bold",
                  color: "black",
                  textDecoration: "underline",
                }}
              >
                {filterTerm}
              </span>
              is {courses.data.length}.
              <br />
              {filters?.filterLevel && filters.filterLevel.length > 0
                ? `Level: `
                : null}
              {filters?.filterLevel && filters.filterLevel.length > 0 ? (
                <span style={{ fontWeight: "bold" }}>
                  {filters.filterLevel.split(" ")[0]}
                </span>
              ) : null}{" "}
              <br />
              {filters?.filterDuration && filters.filterDuration.length > 0
                ? `Duration: `
                : null}
              {filters?.filterDuration && filters.filterDuration.length > 0 ? (
                <span style={{ fontWeight: "bold" }}>
                  {filters.filterDuration}
                </span>
              ) : null}
            </Alert>
          ) : null}
        </Grid>
        <Grid
          item
          xs={12}
          md={12}
          lg={12}
          xl={12}
          style={{ display: "flex", justifyContent: "center" }}
        >
          {courses?.totalNumOfCourses &&
          Math.ceil(courses.totalNumOfCourses / 12) > 1 ? (
            <PaginationComponent
              page={page}
              handleChange={handlePagination}
              numberOfPages={Math.ceil(courses.totalNumOfCourses / 12)}
              numberOfItems={Object.keys(courses.data).length}
            />
          ) : null}
        </Grid>
        <Grid item xs={12} md={3} lg={3} xl={2}>
          <Box justifyContent={"center"}>
            <Button
              onClick={() => setDisplayFilters(!displayFilters)}
              className={classes.filtersToggleButton}
              startIcon={<FilterListIcon />}
              endIcon={
                displayFilters ? (
                  <KeyboardArrowDownIcon />
                ) : (
                  <KeyboardArrowUpIcon />
                )
              }
              color={"info"}
              variant="contained"
            >
              Filters
            </Button>
          </Box>
          {displayFilters ? (
            <>
              <Box justifyContent={"center"} className={classes.filterLevels}>
                <span style={{ fontWeight: "bold" }}>
                  {filterItems[0].map((item, index) => {
                    return (
                      <FormControl key={item}>
                        <FormControlLabel
                          label={item}
                          control={
                            <Checkbox
                              name={item}
                              onChange={handleLevelFilter("filterLevel")}
                              checked={Boolean(levelFilter[index])}
                            />
                          }
                        />
                      </FormControl>
                    );
                  })}
                </span>
              </Box>

              <Box
                justifyContent={"center"}
                className={classes.filterDurations}
              >
                <span style={{ fontWeight: "bold" }}>
                  {filterItems[1].map((item, index) => {
                    return (
                      <FormControl key={item}>
                        <FormControlLabel
                          label={item}
                          control={
                            <Checkbox
                              name={item}
                              onChange={handleDurationFilter("filterDuration")}
                              checked={Boolean(durationFilter[index])}
                            />
                          }
                        />
                      </FormControl>
                    );
                  })}
                </span>
              </Box>
            </>
          ) : null}
        </Grid>

        <Grid item xs={12} md={8} lg={6} xl={5}>
          {courses?.data ? (
            <Box className={classes.displayCoursesContainer}>
              {_.chain(Object.values(courses.data))

                .map((item) => (
                  <Card>
                    <CardMedia
                      className={classes.image}
                      component={"img"}
                      src={item.courseImage}
                    ></CardMedia>

                    <CardContent style={{ width: "100%" }}>
                      <MouseOverPopover
                        title={item.title}
                        styleTitle={classes.title}
                        courseToDisplay={courseToDisplay}
                        loggedUser={loggedUser}
                        courses={courses}
                        popupWindow={classes.stylePopupWindow}
                        styleCard={classes.styleCard}
                        styleEnrolledInCourseMessage={
                          classes.enrolledInCourseCardMessage
                        }
                        id={item._id}
                      />

                      <Typography
                        component={"p"}
                        className={classes.description}
                      >
                        Mentor: {item.mentorId}
                      </Typography>
                      <Typography
                        component={"p"}
                        className={classes.description}
                      >
                        {`Duration: ${item.duration}`}
                      </Typography>
                      <Typography
                        component={"p"}
                        className={classes.description}
                      >
                        {` Level: ${item.level}`}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        disabled={
                          loggedUser?.user &&
                          loggedUser.user.enrolledInCourses.includes(item._id)
                            ? true
                            : false
                        }
                        style={{ marginLeft: "auto" }}
                        onClick={() => enroll(item._id)}
                      >
                        Enroll
                      </Button>
                    </CardActions>
                  </Card>
                ))
                .value()}
            </Box>
          ) : (
            "Loading..."
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default Courses;
