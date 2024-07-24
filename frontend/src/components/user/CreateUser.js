import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import jwtDecode from "jwt-decode";
import {
  setSignupUserForm,
  setSigninUserForm,
  cleanSignupMessage,
  createUser,
  getCreateUserStatus,
  cleanCreateUserStatus,
  fetchUsers,
  setUsersDisplayPage,
  userToken,
  getUserToken,
  getLoggedUserData,
  reLoginUser,
  setUserToken,
  cleanReloginStatus,
} from "../../features/eLearningSlice";
import {
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  Icon,
  Grid,
} from "@mui/material";
import TextFieldsGenerator from "../utils/TextFieldsGenerator";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 600,
    textAlign: "center",
    margin: "0 auto",
    marginTop: theme.spacing(5),
    paddingBottom: theme.spacing(2),
    [theme.breakpoints.only("xs")]: {
      maxWidth: 300,
      padding: theme.spacing(2),
      margin: "0 auto",
      marginTop: theme.spacing(2),
    },
  },
  error: {
    verticalAlign: "middle",
    fontSize: "18px",
  },
  title: {
    marginTop: theme.spacing(2),
    color: theme.palette.openTitle,
    [theme.breakpoints.only("xs")]: {
      marginTop: theme.spacing(0),
    },
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300,
    [theme.breakpoints.only("xs")]: {
      margin: theme.spacing(2),
      maxWidth: 220,
    },
  },
  submit: {
    margin: "auto !important",
    marginBottom: theme.spacing(2),
    [theme.breakpoints.only("xs")]: {
      marginBottom: theme.spacing(0),
    },
  },
  hasAccount: {
    margin: "auto",
    marginBottom: theme.spacing(1),
    marginRight: "0",
    [theme.breakpoints.only("xs")]: {
      marginLeft: "30px",
    },
  },
  signin: {
    margin: "auto",
    marginBottom: theme.spacing(1),
  },
  signUpForMentorAccount: {
    color: "green",
  },
  largeScreens: {
    [theme.breakpoints.only("xs")]: {
      display: "none",
    },
  },
  smallScreens: {
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  mentorAccount: {
    fontSize: "14px",
    fontWeight: "bold",
  },
  textFields: {
    minWidth: "320px",
  },
}));
const CreateUser = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const createUserStatus = useSelector(getCreateUserStatus);
  const token = useSelector(getUserToken);
  const loggedUser = useSelector(getLoggedUserData);

  useEffect(() => {
    if (Object.keys(loggedUser).length === 0 && !token?.message) {
      dispatch(userToken());
    }

    if (token?.message && Object.keys(loggedUser).length === 0) {
      dispatch(reLoginUser(jwtDecode(token.message)._id));
      dispatch(setUserToken("user reloged"));
    }

    if (loggedUser?.relogin) {
      dispatch(cleanReloginStatus());
    }

    if (createUserStatus?.message) {
      dispatch(cleanCreateUserStatus());
      const users = {
        firstItem: 0,
        lastItem: 12,
      };
      dispatch(setUsersDisplayPage(1));
      dispatch(fetchUsers(users));
      navigate("/admin/users");
    }
  }, [createUserStatus, loggedUser, token]);

  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    password: "",
    email: "",
    role: "student",
    confirmationPassword: "",
    open: false,
    error: "",
  });

  const handleChange = (name) => (event) => {
    let course = {};

    course = {
      [name]: event.target.value,
    };

    setValues({
      ...values,
      ...course,
    });
  };

  const formatUserData = (str) => {
    return (
      str.charAt(0).toUpperCase() + str.substr(1, str.length).toLowerCase()
    );
  };

  const clickSubmit = () => {
    const user = {
      firstName: formatUserData(values.firstName) || undefined,
      lastName: formatUserData(values.lastName) || undefined,
      email: values.email || undefined,
      password: values.password || undefined,
      role: values.role,
    };

    if (!values.confirmationPassword || values.confirmationPassword === "") {
      setValues({ ...values, error: "Please repeat your password" });
      return;
    } else if (values.password !== values.confirmationPassword) {
      setValues({ ...values, error: "Password do not match" });
      return;
    } else {
      setValues({ ...values, error: "" });
    }

    dispatch(createUser(user));
  };
  const redirectToSignin = () => {
    dispatch(setSignupUserForm(false));
    dispatch(setSigninUserForm(true));
    dispatch(cleanSignupMessage());
  };

  const signupData = [
    "firstName",
    "lastName",
    "email",
    "password",
    "confirmationPassword",
  ];

  const labels = [
    "Firstname",
    "Lastname",
    "Email",
    "Password",
    "Confirmation Password",
  ];

  const types = ["text", "text", "text", "password", "password"];

  return (
    <Card className={classes.card}>
      <Grid container justifyContent="center">
        <CardContent>
          <h1>Create User</h1>
          <Grid item xs={12} md={12} lg={12} xl={12}>
            <TextFieldsGenerator
              array={signupData}
              handleChange={handleChange}
              values={values}
              value={signupData}
              labels={labels}
              className={classes.textFields}
              types={types}
            />

            {values.error ? (
              <Typography component="p" color="error">
                <Icon color="error" className={classes.error}></Icon>
                {values.error}
              </Typography>
            ) : (
              createUserStatus?.error && (
                <Typography component="p" color="error">
                  <Icon color="error" className={classes.error}></Icon>
                  {createUserStatus.error}
                </Typography>
              )
            )}
          </Grid>
        </CardContent>
        <Grid item xs={12} md={12} lg={12} xl={12}>
          <CardActions>
            <Button
              color="primary"
              variant="contained"
              onClick={clickSubmit}
              className={classes.submit}
            >
              Submit
            </Button>
          </CardActions>
        </Grid>
      </Grid>
    </Card>
  );
};

export default CreateUser;
