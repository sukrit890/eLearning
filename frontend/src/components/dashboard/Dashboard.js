import { useDispatch, useSelector } from "react-redux";
import jwtDecode from "jwt-decode";
import {
  cleanReloginStatus,
  fetchCourses,
  fetchUserData,
  fetchUsers,
  getCloseAccountFormStatus,
  getEditUserFormStatus,
  getEditUserPasswordFormStatus,
  getLoggedUserData,
  getMentorCourses,
  getSelectedFilterTerm,
  getUserToken,
  reLoginUser,
  setUserToken,
  userToken,
} from "../../features/eLearningSlice";
import { Typography, useMediaQuery, Alert, Grid } from "@mui/material";
import CloseAccountForm from "../user/DeleteAccountForm";
import DeleteAccountModal from "../user/DeleteAccountModal";
import EditUserDataButtons from "./DashboardButtons";
import EditProfile from "../user/EditUserProfile";
import DashboardLeftPanel from "./DashboardLeftPanel";
import DashboardRightPanel from "./DashboardRightPanel";
import EditUserPassword from "../user/EditUserPassword";
import { makeStyles } from "@mui/styles";
import { useEffect } from "react";

const useStyles = makeStyles((theme) => ({
  largeScreens: {
    marginTop: "20px",
    [theme.breakpoints.only("xs")]: {
      display: "none",
    },
  },
  smallScreens: {
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  editProfileButtons: {
    marginTop: "40px",
    [theme.breakpoints.only("md")]: {
      marginLeft: "20px",
    },
  },
  dashboardTitle: {
    fontSize: "20px",
    marginBottom: "20px",
    backgroundColor: "lightblue",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  numberOfSelectedCourses: {
    textAlign: "left",
    marginLeft: "10px",
  },
  selectedTerm: {
    fontWeight: "900",
    textDecoration: "underline",
  },
}));

const Dashboard = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const editUserProfile = useSelector(getEditUserFormStatus);
  const editUserPassword = useSelector(getEditUserPasswordFormStatus);
  const closeAccount = useSelector(getCloseAccountFormStatus);
  const filterTerm = useSelector(getSelectedFilterTerm);
  const mentorCourses = useSelector(getMentorCourses);
  const loggedUser = useSelector(getLoggedUserData);
  const token = useSelector(getUserToken);

  const iPadAirScreen = useMediaQuery("(width:820px)");
  const iPadMiniScreen = useMediaQuery("(width:768px)");
  const surfaceDuo = useMediaQuery("(width:912px)");

  return (
    <Grid container>
      <Grid item xs={12} md={12} lg={12} xl={12}>
        <Alert
          variant="filled"
          color="info"
          severity="info"
          className={classes.dashboardTitle}
        >
          {loggedUser?.user && loggedUser.user.role === "admin"
            ? `Welcome ${loggedUser.user.firstName} ${loggedUser.user.lastName}`
            : null}
          {loggedUser?.user && loggedUser.user.role !== "admin"
            ? "Courses - Your Current Courses"
            : null}
          {loggedUser?.user && loggedUser.user.role === "student"
            ? "and Progress"
            : null}
        </Alert>
        {loggedUser?.user && filterTerm && loggedUser.user.role === "mentor" ? (
          mentorCourses.data.length > 1 ? (
            <Typography
              variant="h5"
              className={classes.numberOfSelectedCourses}
            >
              There are {mentorCourses.data.length} results for the term{" "}
              <span className={classes.selectedTerm}>{filterTerm}</span>
            </Typography>
          ) : (
            <Typography
              variant="h5"
              className={classes.numberOfSelectedCourses}
            >
              There is {mentorCourses.data.length} result for the term{" "}
              <span className={classes.selectedTerm}>{filterTerm}</span>
            </Typography>
          )
        ) : null}
      </Grid>
      <Grid item xs={12} md={3} lg={3} xl={3}>
        <DashboardLeftPanel />
      </Grid>
      <Grid item xs={12} md={6} lg={6} xl={6} className={classes.smallScreens}>
        <DashboardRightPanel />
      </Grid>

      {!editUserProfile && !editUserPassword && !closeAccount ? (
        <Grid
          item
          xs={12}
          md={8}
          lg={8}
          xl={8}
          className={classes.largeScreens}
        >
          {!iPadAirScreen && !iPadMiniScreen && !surfaceDuo ? (
            <DashboardRightPanel />
          ) : null}
        </Grid>
      ) : (
        <>
          <Grid
            item
            xs={12}
            md={2}
            lg={2}
            xl={2}
            className={classes.smallScreens}
          >
            <EditUserDataButtons />
          </Grid>
          <Grid item xs={12} md={6} lg={6} xl={6}>
            {editUserProfile ? <EditProfile /> : null}
            {editUserPassword ? <EditUserPassword /> : null}
            {closeAccount ? <CloseAccountForm /> : null}
          </Grid>
          <Grid
            item
            xs={12}
            md={2}
            lg={2}
            xl={2}
            className={classes.largeScreens}
          >
            {!iPadAirScreen && !iPadMiniScreen && !surfaceDuo ? (
              <EditUserDataButtons />
            ) : null}
          </Grid>
        </>
      )}
      <DeleteAccountModal />
    </Grid>
  );
};

export default Dashboard;
