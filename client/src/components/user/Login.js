import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  signinUser,
  userToken,
  setSigninUserForm,
  setSignupUserForm,
  getLoggedUserData,
  cleanLoginMessage,
  fetchCourses,
  fetchMentorCourses,
  fetchUsers,
  fetchUserCourses,
  fetchMentors,
} from "../../features/eLearningSlice";
import {
  Card,
  CardActions,
  CardContent,
  Button,
  TextField,
  Typography,
  Icon,
  Grid,
  useMediaQuery,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 600,
    textAlign: "center",
    margin: "0 auto",
    marginTop: theme.spacing(5),
    paddingBottom: theme.spacing(2),
    [theme.breakpoints.only("xs")]: {
      maxWidth: 260,
      padding: theme.spacing(2),
      margin: "0 auto",
      marginTop: theme.spacing(2),
    },
  },
  error: {
    verticalAlign: "middle",
  },
  title: {
    marginTop: theme.spacing(2),
    color: theme.palette.openTitle,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300,
    [theme.breakpoints.only("xs")]: {
      maxWidth: 220,
    },
  },
  submit: {
    marginBottom: theme.spacing(2),
    margin: "0 auto !important",
  },
  signup: {
    margin: "0 auto !important",
    marginBottom: theme.spacing(1),
    marginLeft: "10px !important",
  },
  noaccount: {
    marginLeft: "60px",
    [theme.breakpoints.only("xs")]: {
      marginLeft: "40px !important",
    },
  },
  noAccountContainer: {
    display: "inline-flex",
    margin: "0 auto",
  },
}));

const Login = () => {
  const classes = useStyles();
  const loggedUser = useSelector(getLoggedUserData);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (loggedUser?.token) {
      dispatch(userToken());
      if (loggedUser.user.role === "student") {
        const courses = {
          firstItem: 0,
          lastItem: 12,
        };
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
        dispatch(fetchMentors());
        dispatch(fetchCourses(courses));
        navigate("/dashboard");
      }

      if (loggedUser.user.role === "mentor") {
        const user = {
          mentorId: loggedUser.user._id,
          firstItem: 0,
          lastItem: 12,
        };

        dispatch(fetchMentorCourses(user));
        navigate("/dashboard");
        return;
      }

      const courses = {
        firstItem: 0,
        lastItem: 12,
      };

      dispatch(fetchCourses(courses));

      if (loggedUser.user.role === "admin") {
        const users = {
          firstItem: 0,
          lastItem: 12,
        };

        dispatch(fetchUsers(users));
        navigate("/dashboard");
      }
    }
  }, [loggedUser]);

  const clickSubmit = () => {
    const user = {
      email: values.email || undefined,
      password: values.password || undefined,
    };
    dispatch(signinUser(user));
  };

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const redirectToSignup = () => {
    dispatch(setSigninUserForm(false));
    dispatch(setSignupUserForm(true));
    dispatch(cleanLoginMessage());
  };

  return (
    <Card className={classes.card}>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={12} lg={12} xl={12}>
          <CardContent>
            <Typography variant="h6" className={classes.tittle}>
              LOGIN
            </Typography>

            <TextField
              id="email"
              type="email"
              label="Email"
              className={classes.textField}
              value={values.email}
              onChange={handleChange("email")}
              margin="normal"
            />
            <br />

            <TextField
              id="password"
              type="password"
              label="Password"
              className={classes.textField}
              value={values.password}
              onChange={handleChange("password")}
              margin="normal"
            />
            <br />
            {
              //display error returned from server
              Object.keys(loggedUser).length !== 0 && (
                <Typography component="p" color="error">
                  <Icon color="error" className={classes.error}></Icon>
                  {loggedUser.error}
                </Typography>
              )
            }
          </CardContent>
        </Grid>
        <Grid item xs={12} md={12} lg={3} xl={3}>
          <CardActions>
            <Button
              color="primary"
              variant="contained"
              onClick={clickSubmit}
              className={classes.submit}
            >
              Login
            </Button>
          </CardActions>
        </Grid>
        <br />
        <Grid container justifyContent="center">
          <Grid item xs={12} md={6} lg={6} xl={6}>
            <CardActions>
              <span className={classes.noAccountContainer}>
                <Typography component="p" className={classes.noaccount}>
                  No account?
                </Typography>

                <Typography
                  component="p"
                  color="primary"
                  className={classes.signup}
                  onClick={redirectToSignup}
                >
                  SIGN UP
                </Typography>
              </span>
            </CardActions>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
};

export default Login;
