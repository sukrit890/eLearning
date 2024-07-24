import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import jwtDecode from "jwt-decode";
import {
  fetchCourses,
  getCourses,
  getCoursesDisplayPage,
  getDeleteCourseMessage,
  setCoursesDisplayPage,
  cleanDeleteCourseMessage,
  removeCourse,
  setCourseToEdit,
  getCourseDeleteModalStatus,
  setCourseDeleteModal,
  getSelectedFilterTerm,
  getLoggedUserData,
  cleanFilterTerm,
  getFilter,
  setAdminFilters,
  getAdminFilters,
  setFilter,
  setFilterTerm,
  cleanReloginStatus,
  getUserToken,
  reLoginUser,
  userToken,
  setUserToken,
  cleanStore,
} from "../../features/eLearningSlice";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import {
  Tooltip,
  Button,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Alert,
  Box,
  Card,
  CardMedia,
  Typography,
} from "@mui/material";
import SelectComponent from "../utils/SelectComponent";
import PaginationComponent from "../utils/Pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
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
  addCourseButtonContainer: {
    paddingTop: "20px !important",
    paddingRight: "20px",
  },
  addCourseButton: {
    paddingRight: "10px",
    paddingTop: "20px",
    backgroundColor: "#2F4F4F !important",
    minWidth: "320px !important",
    minHeight: "50px !important",
    [theme.breakpoints.only("xs")]: {
      width: "95%",
      marginLeft: "5px !important",
    },
  },
  warningIcon: {
    fontSize: "60px",
  },
  container: { overflow: "hidden" },
  filterResults: {
    marginTop: "20px",
  },
  mentorCoursesContainer: {
    maxHeight: "50vh",
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
  cardImage: {
    marginTop: "5px",
    maxWidth: "220px",
    maxHeight: "220px",
    marginRight: "20px",
    marginLeft: "20px",
  },
  cardText: { paddingLeft: "10px" },
  cardTitle: {
    fontWeight: "900 !important",
    textAlign: "left",
    marginBottom: "5px !important",
  },
  description: {
    textAlign: "left",
    marginBottom: "15px !important",
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
  mentor: {
    textAlign: "left",
    marginBottom: "15px !important",
    fontStyle: "italic",
  },
  coursesFixedContainer: {
    position: "fixed",
    [theme.breakpoints.only("xs")]: {
      position: "unset",
    },
  },
  removeFilters: {
    paddingRight: "10px",
    paddingTop: "20px",
    backgroundColor: "#2F4F4F !important",
    minWidth: "220px !important",
    minHeight: "50px !important",
    marginLeft: "10px !important",
    [theme.breakpoints.only("xs")]: {
      width: "95%",
      marginLeft: "5px !important",
      marginTop: "10px !important",
    },
  },
}));

const AllCourses = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [courseToDelete, setCourseToDelete] = useState({});
  const filterTerm = useSelector(getSelectedFilterTerm);

  const courses = useSelector(getCourses);
  const page = useSelector(getCoursesDisplayPage);
  const deleteCourseStatus = useSelector(getDeleteCourseMessage);
  const courseDeleteModalStatus = useSelector(getCourseDeleteModalStatus);
  const loggedUser = useSelector(getLoggedUserData);
  const token = useSelector(getUserToken);

  const rows = [];

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
      if (loggedUser?.user && loggedUser.user.role === "admin") {
        const courses = {
          firstItem: 0,
          lastItem: 12,
        };

        dispatch(fetchCourses(courses));
        dispatch(cleanReloginStatus());
      }
    }

    if (deleteCourseStatus?.message) {
      const courses = {
        page: page,
        firstItem: page * 12 - 12,
        lastItem: page * 12,
      };
      dispatch(fetchCourses(courses));
      dispatch(setCourseDeleteModal(false));
      dispatch(cleanDeleteCourseMessage());
    }
  }, [deleteCourseStatus, loggedUser, token]);

  const handlePagination = (event, value) => {
    const courses = {
      ...filters,
      page: value,
      filterTerm: filterTerm || undefined,
      firstItem: value * 12 - 12,
      lastItem: value * 12,
    };

    dispatch(setCoursesDisplayPage(value));
    dispatch(fetchCourses(courses));
  };

  const [filters, setFilters] = useState({
    sortByTitle: true,
    sortByMentorName: false,
    sortTitle: "",
    sortMentorName: "",
    filterLevel: "",
    filterDuration: "",
  });

  const handleChange = (name) => (event) => {
    if (name === "sortTitle") {
      setFilters({
        ...filters,
        [name]: event.target.value,
        sortByTitle: true,
        sortByMentorName: false,
      });
    } else if (name === "sortMentorName") {
      setFilters({
        ...filters,
        [name]: event.target.value,
        sortByTitle: false,
        sortByMentorName: true,
      });
    } else {
      const courses = {
        filterLevel: filters.filterLevel ? filters.filterLevel : undefined,
        filterDuration: filters.filterDuration
          ? filters.filterDuration
          : undefined,
        filterTitle: filters.filterTitle ? filters.filterTitle : "",
        filterMentorName: filters.filterMentorName
          ? filters.filterMentorName
          : "",
        filterTerm: filterTerm ? filterTerm : null,
        [name]: event.target.value,
        page: 1,
        firstItem: 0,
        lastItem: 12,
      };
      dispatch(setAdminFilters(courses));
      dispatch(setCoursesDisplayPage(1));
      dispatch(fetchCourses(courses));

      setFilters({
        ...filters,
        [name]: event.target.value,
      });
    }
  };

  const orderBy = ["A-Z", "Z-A"];

  const filterBy = [
    "sortTitle",
    "sortMentorName",
    "filterLevel",
    "filterDuration",
  ];

  const filterByTitles = [
    "Sort By Title",
    "Sort By Mentor Name",
    "Filter By Level",
    "Filter By Duration",
  ];

  const filterItems = [
    ["A-Z", "Z-A"],
    ["A-Z", "Z-A"],
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

  const edit = (id) => {
    dispatch(setCourseToEdit(id));
    navigate("/editCourse");
  };

  const remove = (id) => {
    setCourseToDelete(
      Object.values(courses.data).filter((item) => item._id === id)
    );
    dispatch(setCourseDeleteModal(true));
  };

  const removeFilters = () => {
    const courses = {
      page: 1,
      firstItem: 0,
      lastItem: 12,
      filterLevel: "",
      filterDuration: "",
      filterTitle: "",
      filterMentorName: "",
      filterTerm: undefined,
    };

    dispatch(setCoursesDisplayPage(1));
    dispatch(fetchCourses(courses));
    dispatch(setFilter(""));
    dispatch(setAdminFilters(courses));
    setFilters({
      filterByTitle: true,
      filterByMentorName: false,
      filterTitle: "A-Z",
      filterMentorName: "A-Z",
      filterLevel: "",
      filterDuration: "",
    });
    dispatch(setFilterTerm(""));
  };

  return (
    <Grid
      container
      justifyContent={"center"}
      spacing={2}
      className={classes.container}
    >
      <Grid item xs={12} md={6} lg={6} xl={6}>
        {filterTerm ? (
          <Alert
            variant="filled"
            color="info"
            severity="info"
            className={classes.filterResults}
          >
            {loggedUser.user.role === "admin" && courses.data.length > 1 ? (
              <>
                {`There are ${courses.data.length} results for the term `}
                <span className={classes.selectedTerm}>{filterTerm}</span>
              </>
            ) : (
              <>
                {`There is ${courses.data.length} result for the term `}
                <span className={classes.selectedTerm}>{filterTerm}</span>
              </>
            )}
          </Alert>
        ) : null}
      </Grid>
      <Grid
        container
        justifyContent={"flex-end"}
        className={classes.addCourseButtonContainer}
      >
        <Button
          variant="contained"
          onClick={() => navigate("/addCourse")}
          className={classes.addCourseButton}
        >
          Add courses
        </Button>
        <Button
          variant="contained"
          onClick={removeFilters}
          className={classes.removeFilters}
        >
          Remove filters
        </Button>
      </Grid>
      {Object.values(filterItems).map((item, index) => {
        return (
          <Grid key={Math.random() + 1} item xs={12} md={3} lg={2} xl={2}>
            {filterByTitles[index]}
            <SelectComponent
              className={classes.selectFields}
              array={filterItems[index]}
              selectedValue={filters[filterBy[index]] || ""}
              handleChange={handleChange(filterBy[index])}
            />
          </Grid>
        );
      })}

      <Grid item xs={12} md={10} lg={10} xl={9}>
        <Grid container justifyContent={"space-around"}>
          <Grid item xs={12} md={12} lg={12} xl={12}>
            <Grid container justifyContent={"center"}>
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
          </Grid>

          {courses?.data ? (
            <Box className={classes.mentorCoursesContainer}>
              {_.chain(Object.values(courses.data))
                .orderBy(
                  [
                    filters.sortByTitle
                      ? (course) => course.title.toLowerCase()
                      : filters.sortByMentorName
                      ? (course) => course.mentorId.toLowerCase()
                      : null,
                  ],
                  [
                    filters.sortByTitle
                      ? filters.sortTitle === "A-Z"
                        ? "asc"
                        : "desc"
                      : filters.sortByMentorName
                      ? filters.sortMentorName === "A-Z"
                        ? "asc"
                        : "desc"
                      : null,
                  ]
                )
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
                          src={item.courseImage}
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
                        <Typography variant="h5" className={classes.cardTitle}>
                          {item.title}
                        </Typography>

                        <Typography
                          component={"p"}
                          className={classes.description}
                        >
                          {item.description}
                        </Typography>

                        <Typography component={"p"} className={classes.mentor}>
                          Mentor: {item.mentorId}
                        </Typography>

                        <span className={classes.durationAndLevelTextContainer}>
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

export default AllCourses;
