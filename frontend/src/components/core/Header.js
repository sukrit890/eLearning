import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import jwtDecode from "jwt-decode";
import {
  setSigninUserForm,
  setSignupUserForm,
  getLoggedUserData,
  cleanLoginMessage,
  cleanSignupMessage,
  setFilter,
  fetchUsers,
  fetchCourses,
  cleanFilterTerm,
  setEditUserPasswordForm,
  setEditUserProfileForm,
  setCloseAccountForm,
  setCloseAccountModal,
  userToken,
  reLoginUser,
  getUserToken,
  cleanReloginStatus,
  cleanStore,
  getSignedOutUserStatus,
  setUserToken,
  getCourses,
  getUsers,
  setStoreStatus,
  setClearSignoutUserMessage,
} from "../../features/eLearningSlice";
import { Box, Button, Grid, Typography, AppBar } from "@mui/material";
import Search from "../utils/Search";
import { makeStyles } from "@mui/styles";
import { useEffect } from "react";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";

const useStyles = makeStyles((theme) => ({
  headerContainer: {
    paddingBottom: "20px",
  },
  loginButton: {
    textTransform: "none !important",
    marginLeft: "30px !important",
    marginTop: "10px !important",
    color: "white !important",
    fontSize: "1.2rem !important",
    fontWeight: "bold !important",
  },
  signupButton: {
    textTransform: "none !important",
    marginTop: "10px !important",
    marginLeft: "5px !important",
    color: "white !important",
    fontSize: "1.2rem !important",
    fontWeight: "bold !important",
  },
  loginSignupButtons: { marginLeft: "auto !important" },
}));

const Header = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loggedUser = useSelector(getLoggedUserData);
  const signoutUserStatus = useSelector(getSignedOutUserStatus);
  const courses = useSelector(getCourses);
  const users = useSelector(getUsers);
  const signedOutUserStatus = useSelector(getSignedOutUserStatus);

  const token = useSelector(getUserToken);

  const routes = [
    "/dashboard",
    "/admin/users",
    "/admin/courses",
    "/editCourse",
    "/editProfile",
    "/addCourse",
    "/courses",
    "/admin/createUser",
    "/unathorizedUser",
  ];

  useEffect(() => {
    if (token === "Request failed with status code 401") {
      navigate("/");
      dispatch(setStoreStatus({ message: "cleaned" }));
    }

    if (loggedUser === "signout") {
      dispatch(cleanStore());
      dispatch(setStoreStatus({ message: "cleaned" }));
    }
    if (
      Object.keys(loggedUser).length === 0 &&
      !token?.message &&
      token.length !== 12
    ) {
      dispatch(userToken());
    }

    if (
      token?.message &&
      Object.keys(loggedUser).length === 0 &&
      token.length !== 12 &&
      token !== "user reloged" &&
      loggedUser !== "signout"
    ) {
      dispatch(reLoginUser(jwtDecode(token.message)._id));

      dispatch(setUserToken("user reloged"));
    }
    if (loggedUser?.relogin) {
      if (loggedUser.user.role === "admin" && Object.keys(users).length === 0) {
        const users = {
          firstItem: 0,
          lastItem: 12,
        };

        dispatch(fetchUsers(users));
      }

      if (
        loggedUser.user.role === "admin" &&
        Object.keys(courses).length === 0
      ) {
        const courses = {
          firstItem: 0,
          lastItem: 12,
        };
        dispatch(fetchCourses(courses));
      }
      dispatch(cleanReloginStatus());
    }
    if (!routes.includes(window.location.pathname)) {
      navigate("/");
    }
  }, [
    token,
    signoutUserStatus,
    loggedUser,
    token,
    signedOutUserStatus.message,
  ]);

  const login = () => {
    dispatch(setClearSignoutUserMessage());

    if (window.location !== "/") {
      navigate("/");
    }
    dispatch(setSignupUserForm(false));
    dispatch(setSigninUserForm(true));
    dispatch(cleanSignupMessage());
  };

  const signup = () => {
    dispatch(setClearSignoutUserMessage());
    if (window.location !== "/") {
      navigate("/");
    }
    dispatch(setSigninUserForm(false));
    dispatch(setSignupUserForm(true));
    dispatch(cleanLoginMessage());
  };

  const redirectToDashboard = () => {
    if (loggedUser?.user) {
      dispatch(cleanFilterTerm());

      if (loggedUser?.user && loggedUser.user.role === "admin") {
        const users = {
          firstItem: 0,
          lastItem: 12,
        };

        dispatch(fetchUsers(users));
      }
      const courses = {
        firstItem: 0,
        lastItem: 12,
        filterTerm: undefined,
      };

      dispatch(fetchCourses(courses));
      dispatch(setFilter(""));

      dispatch(setEditUserProfileForm(false));
      dispatch(setEditUserPasswordForm(false));
      dispatch(setCloseAccountForm(false));
      dispatch(setCloseAccountModal(false));

      window.location.pathname !== "/" && navigate("/dashboard");
    }
  };

  return (
    <AppBar position="static" className={classes.headerContainer}>
      <div style={{ marginRight: "auto" }}>
        {loggedUser?.user && window.location.pathname !== "/dashboard" ? (
          <Button
            startIcon={<KeyboardReturnIcon />}
            variant="text"
            color="info"
            onClick={redirectToDashboard}
            style={{
              color: "grey",
              fontWeight: "bold",
              fontSize: "1.2rem",
              textTransform: "none",
            }}
          >
            Dashboard
          </Button>
        ) : null}
      </div>
      <Grid container justifyContent={"center"}>
        {loggedUser?.user && !signedOutUserStatus?.message && (
          <>
            <Grid
              item
              xs={12}
              md={12}
              lg={12}
              xl={12}
              style={{ marginTop: "12px" }}
              className={classes.dashboardTitle}
            >
              <Typography variant="h5" style={{ wordBreak: "normal" }}>
                {loggedUser.user.role === "admin" &&
                !signedOutUserStatus?.message &&
                window.location.pathname === "/dashboard"
                  ? "Admin Dashboard"
                  : loggedUser.user.role === "mentor" &&
                    !signedOutUserStatus?.message &&
                    window.location.pathname === "/dashboard"
                  ? "Mentor Dashboard"
                  : loggedUser.user.role === "student" &&
                    !signedOutUserStatus?.message &&
                    window.location.pathname === "/dashboard"
                  ? "Student Dashboard"
                  : null}
              </Typography>
            </Grid>

            <Grid item xs={12} md={10} lg={8} xl={8}>
              <Search />
            </Grid>
          </>
        )}

        {!loggedUser.user && (
          <>
            <Grid
              item
              xs={12}
              md={3}
              lg={3}
              xl={3}
              className={classes.loginSignupButtons}
            >
              <Button
                variant="text"
                color="info"
                onClick={login}
                className={classes.loginButton}
              >
                Log In
              </Button>

              <Button
                variant="text"
                color="info"
                onClick={signup}
                className={classes.signupButton}
              >
                Sign Up
              </Button>
            </Grid>
          </>
        )}
      </Grid>
    </AppBar>
  );
};

export default Header;
