import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import jwtDecode from "jwt-decode";
import {
  cleanFilterTerm,
  cleanReloginStatus,
  cleanStore,
  fetchCourses,
  fetchUsers,
  getCourses,
  getLoggedUserData,
  getMentorCourses,
  getUsers,
  getUserToken,
  reLoginUser,
  setCloseAccountForm,
  setCloseAccountModal,
  setEditUserPasswordForm,
  setEditUserProfileForm,
  setLoggedUserStatus,
  setLoggedUserToEdit,
  setUserToken,
  signoutUser,
  userToken,
} from "../../features/eLearningSlice";
import { Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faChalkboardUser,
  faHouse,
  faGear,
  faRightFromBracket,
  faUserGroup,
  faCube,
} from "@fortawesome/free-solid-svg-icons";
import ButtonGroupWithIcons from "./LeftSidePanelButtons";
import { makeStyles } from "@mui/styles";
import { useEffect } from "react";

const useStyles = makeStyles((theme) => ({
  userIcon: {
    fontSize: "48px",
    marginTop: "60px",
    [theme.breakpoints.only("xs")]: {
      marginTop: "10px",
    },
  },
  buttons: {
    fontSize: "24px",
    marginTop: "30px",
    textTransform: "none",
  },
  userInfo: {
    marginTop: "20px",
    color: "blue",
    fontSize: "28px",
  },
}));

const DashboardLeftPanel = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const mentorCourses = useSelector(getMentorCourses);
  const users = useSelector(getUsers);
  const courses = useSelector(getCourses);
  const token = useSelector(getUserToken);

  const loggedUser = useSelector(getLoggedUserData);

  const redirectToDashboard = () => {
    dispatch(setEditUserProfileForm(false));
    dispatch(setEditUserPasswordForm(false));
    dispatch(setCloseAccountModal(false));
    dispatch(setCloseAccountForm(false));
    navigate("/dashboard");
  };

  const displayAllUsers = () => {
    dispatch(setEditUserProfileForm(false));
    dispatch(setEditUserPasswordForm(false));
    dispatch(setCloseAccountModal(false));
    dispatch(setCloseAccountForm(false));
    const users = {
      firstItem: 0,
      lastItem: 12,
    };
    dispatch(cleanFilterTerm());
    dispatch(fetchUsers(users));
    navigate("/admin/users");
  };

  const displayAllCourses = () => {
    dispatch(setEditUserProfileForm(false));
    dispatch(setEditUserPasswordForm(false));
    dispatch(setCloseAccountModal(false));
    dispatch(setCloseAccountForm(false));
    const courses = {
      firstItem: 0,
      lastItem: 12,
    };

    const users = {
      firstItem: 0,
      lastItem: 12,
    };
    dispatch(cleanFilterTerm());
    dispatch(fetchUsers(users));
    dispatch(fetchCourses(courses));
    navigate("/admin/courses");
  };

  const viewAllAvailableCourses = () => {
    dispatch(setEditUserProfileForm(false));
    dispatch(setEditUserPasswordForm(false));
    dispatch(setCloseAccountModal(false));
    dispatch(setCloseAccountForm(false));
    const courses = {
      firstItem: 0,
      lastItem: 12,
    };
    dispatch(cleanFilterTerm());
    dispatch(fetchCourses(courses));
    navigate("/courses");
  };

  const editUser = () => {
    dispatch(setLoggedUserToEdit(loggedUser.user));
    dispatch(setEditUserProfileForm(true));
  };

  const signout = () => {
    dispatch(signoutUser());
    dispatch(setLoggedUserStatus());
    window.location.reload()
    navigate("/");
  };

  const adminButtonsAndIcons = {
    clickEvents: [
      redirectToDashboard,
      displayAllUsers,
      displayAllCourses,
      editUser,
      signout,
    ],
    buttons: ["Dashboard", "Users", "Courses", "Edit Profile", "Logout"],
    icons: [faHouse, faUserGroup, faCube, faGear, faRightFromBracket],
  };

  const userButtonsAndIcons = {
    clickEvents: [
      redirectToDashboard,
      loggedUser?.user && loggedUser.user.role === "student"
        ? viewAllAvailableCourses
        : null,
      editUser,
      signout,
    ],
    buttons: [
      "Dashboard",
      loggedUser?.user && loggedUser.user.role === "student" ? "Courses" : null,
      "Edit Profile",
      "Logout",
    ],
    icons: [
      faHouse,
      loggedUser?.user && loggedUser.user.role === "student"
        ? faChalkboardUser
        : null,
      faGear,
      faRightFromBracket,
    ],
  };

  const formatUserData = (str) => {
    return (
      str.charAt(0).toUpperCase() + str.substr(1, str.length).toLowerCase()
    );
  };

  return (
    <>
      <FontAwesomeIcon
        icon={faUser}
        className={classes.userIcon}
        color="primary"
      />
      <Typography className={classes.username}>
        {loggedUser?.user
          ? `${formatUserData(loggedUser.user.firstName)} ${formatUserData(
              loggedUser.user.lastName
            )}`
          : null}
      </Typography>

      <ButtonGroupWithIcons
        buttons={
          loggedUser?.user && loggedUser.user.role === "admin"
            ? adminButtonsAndIcons.buttons
            : userButtonsAndIcons.buttons.filter(Boolean)
        }
        clickEvents={
          loggedUser?.user && loggedUser.user.role === "admin"
            ? adminButtonsAndIcons.clickEvents
            : userButtonsAndIcons.clickEvents.filter(Boolean)
        }
        icons={
          loggedUser?.user && loggedUser.user.role === "admin"
            ? adminButtonsAndIcons.icons
            : userButtonsAndIcons.icons.filter(Boolean)
        }
      />

      {loggedUser?.user && loggedUser.user.role === "student" ? (
        <>
          <Typography variant="h6" className={classes.userInfo}>
            Completed
            <br />
            courses
            <br />
            {loggedUser.user.completedCourses.length}
          </Typography>
          <Typography variant="h6" className={classes.userInfo}>
            In progress
            <br />
            {loggedUser.user?.enrolledInCourses
              ? [...new Set(loggedUser.user.enrolledInCourses)].length -
                loggedUser.user.completedCourses.length
              : "0"}
          </Typography>
        </>
      ) : loggedUser?.user && loggedUser.user.role === "mentor" ? (
        <>
          <Typography variant="h6" className={classes.userInfo}>
            Total number <br />
            of courses
            <br />
            {mentorCourses.totalNumOfCourses}
          </Typography>
        </>
      ) : loggedUser?.user && courses?.data && users?.data ? (
        <>
          <Typography variant="h6" className={classes.userInfo}>
            Total number of <br />
            users
            <br />
            {users.totalNumOfUsers}
          </Typography>
          <Typography variant="h6" className={classes.userInfo}>
            Total number of <br />
            courses
            <br />
            {courses.totalNumOfCourses}
          </Typography>
        </>
      ) : null}
    </>
  );
};

export default DashboardLeftPanel;
