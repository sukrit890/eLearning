import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchCourses,
  fetchMentorCourses,
  fetchUserCourses,
  fetchUsers,
  getAdminFilters,
  getFilter,
  getLoggedUserData,
  getMentorFilters,
  getStudentFilters,
  setCoursesDisplayPage,
  setFilter,
  setFilterTerm,
  setStudentFilters,
} from "../../features/eLearningSlice";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  searchInput: {
    width: "90% !important",
    borderRadius: "25px",
    paddingLeft: "5px",
    backgroundColor: "white",
    marginTop: "12px !important",
    [theme.breakpoints.only("xs")]: {
      marginTop: "10px !important",
    },
  },
}));

export default function Search({ changeHandler }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const filter = useSelector(getFilter);
  const loggedUser = useSelector(getLoggedUserData);
  const studentFilters = useSelector(getStudentFilters);
  const adminFilters = useSelector(getAdminFilters);

  const handleKeyPress = (event) => {
    if (
      window.location.pathname === "/admin/users" &&
      loggedUser.user.role === "admin"
    ) {
      if (event.target.value === "") {
        const users = {
          firstItem: 0,
          lastItem: 12,
          filterTerm: undefined,
        };
        dispatch(setCoursesDisplayPage(1));
        dispatch(setFilterTerm(filter));
        return dispatch(fetchUsers(users));
      }

      if (event.keyCode === 13) {
        const users = {
          firstItem: 0,
          lastItem: 12,
          filterTerm: event.target.value.toLowerCase(),
        };

        dispatch(setFilterTerm(filter));
        return dispatch(fetchUsers(users));
      }
    }
    if (
      window.location.pathname === "/admin/courses" ||
      window.location.pathname === "/courses"
    ) {
      if (event.target.value === "") {
        const courses = {
          filterLevel: "",
          filterDuration: "",
          filterTerm: "",
          firstItem: 0,
          lastItem: 12,
          page: 1,
        };

        dispatch(setStudentFilters(courses));
        dispatch(setCoursesDisplayPage(1));
        dispatch(setFilterTerm(""));
        return dispatch(fetchCourses(courses));
      }

      if (event.keyCode === 13) {
        const courses = {
          filterLevel: studentFilters?.filterLevel
            ? studentFilters.filterLevel
            : adminFilters?.filterLevel
            ? adminFilters.filterLevel
            : undefined,
          filterDuration: studentFilters?.filterDuration
            ? studentFilters.filterDuration
            : adminFilters?.filterDuration
            ? adminFilters.filterDuration
            : undefined,
          filterTerm: filter,
          firstItem: 0,
          lastItem: 12,
          page: 1,
        };

        dispatch(setFilterTerm(filter));

        return dispatch(fetchCourses(courses));
      }
    } else if (
      window.location.pathname === "/dashboard" &&
      loggedUser.user.role === "mentor"
    ) {
      if (event.target.value === "") {
        const courses = {
          mentorId: loggedUser.user._id,
          filterTerm: "",
        };
        dispatch(setCoursesDisplayPage(1));
        dispatch(setFilterTerm(""));
        return dispatch(fetchMentorCourses(courses));
      }

      if (event.keyCode === 13) {
        const courses = {
          mentorId: loggedUser.user._id,
          filterTerm: filter,
        };
        dispatch(setFilterTerm(filter));
        return dispatch(fetchMentorCourses(courses));
      }
    } else if (
      window.location.pathname === "/courses" &&
      loggedUser.user.role === "student"
    ) {
      if (event.target.value === "") {
        const user = {
          userCourses: loggedUser.user.enrolledInCourses,
          param: loggedUser.user._id,
          id: loggedUser.user._id,
          completedCourses: loggedUser.user.completedCourses,
          filterTerm: "",
        };

        dispatch(setCoursesDisplayPage(1));
        dispatch(setFilterTerm(""));
        return dispatch(fetchUserCourses(user));
      }
    }
  };
  const handleChange = (event) => {
    dispatch(setFilter(event.target.value));
  };

  return (
    <TextField
      fullWidth
      onChange={handleChange}
      onKeyDown={handleKeyPress}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      value={filter}
      variant="standard"
      className={classes.searchInput}
    />
  );
}
