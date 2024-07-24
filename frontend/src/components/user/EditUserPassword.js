import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import {
  getLoggedUserData,
  getUpdateUserPasswordStatus,
  clearUpdatePassword,
  updateUserPassword,
  setEditUserPasswordForm,
} from "../../features/eLearningSlice";
import {
  Button,
  TextField,
  Typography,
  Icon,
  Card,
  CardActions,
  CardContent,
} from "@material-ui/core/";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 600,
    margin: "auto",
    textAlign: "center",
    marginTop: theme.spacing(10),
    paddingBottom: theme.spacing(2),
  },
  error: {
    verticalAlign: "middle",
    fontSize: "18px",
  },
  tittle: {
    marginTop: theme.spacing(2),
    color: theme.palette.openTitle,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300,
  },
  save: {
    marginBottom: theme.spacing(2),
    marginRight: theme.spacing(2),
    minWidth: 110,
  },
  cancel: {
    marginLeft: "10px !important",
    marginBottom: theme.spacing(2),
    minWidth: 110,
  },
  buttonContainer: {
    margin: "0 auto",
  },
}));
const EditUserPassword = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const loggedUser = useSelector(getLoggedUserData);
  const updateUserPasswordStatus = useSelector(getUpdateUserPasswordStatus);
  const navigate = useNavigate();

  const [values, setValues] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
    error: "",
  });

  useEffect(() => {
    if (updateUserPasswordStatus?.message) {
      dispatch(clearUpdatePassword());
      setValues({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
        error: "",
      });
      dispatch(setEditUserPasswordForm(false));
    }
  }, [updateUserPasswordStatus, dispatch]);

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const clickSubmit = () => {
    if (
      values.password !== "" &&
      (values.newPassword === "" || values.confirmNewPassword === "")
    ) {
      setValues({
        ...values,
        error: "Enter old, new and repeated password!",
      });
      return;
    } else if (values.newPassword !== values.confirmNewPassword) {
      setValues({
        ...values,
        error: "New and repeated password do not match!",
      });
      return;
    } else {
      setValues({
        ...values,
        error: "",
      });
    }

    const user = {
      param: loggedUser.user._id,
      data: {
        password: values.oldPassword,
        newPassword: values.newPassword,
      },
    };

    dispatch(updateUserPassword(user));
  };

  const cancel = () => {
    dispatch(clearUpdatePassword());
    dispatch(setEditUserPasswordForm(false));
    navigate("/dashboard");
  };

  return (
    <div>
      {loggedUser.user.firstName ? (
        <Card className={classes.card}>
          <CardContent>
            <TextField
              id="firstName"
              className={classes.textField}
              value={values.oldPassword}
              onChange={handleChange("oldPassword")}
              margin="normal"
              placeholder="Old Password"
              type="password"
            />
            <br />

            <TextField
              id="lastName"
              className={classes.textField}
              value={values.newPassword}
              onChange={handleChange("newPassword")}
              margin="normal"
              placeholder="New Password"
              type="password"
            />
            <br />

            <TextField
              id="email"
              className={classes.textField}
              value={values.confirmNewPassword}
              onChange={handleChange("confirmNewPassword")}
              margin="normal"
              placeholder="Confirm New Password"
              type="password"
            />

            <br />
            <br />

            {updateUserPasswordStatus?.error && (
              <Typography component="p" color="error">
                <Icon color="error" className={classes.error}></Icon>
                {updateUserPasswordStatus.error}
              </Typography>
            )}
            {values.error !== "" && (
              <Typography component="p" color="error">
                <Icon color="error" className={classes.error}></Icon>
                {values.error}
              </Typography>
            )}
          </CardContent>

          <CardActions>
            <div className={classes.buttonContainer}>
              <Button
                color="primary"
                variant="contained"
                onClick={clickSubmit}
                className={classes.save}
              >
                Save
              </Button>

              <Button
                color="primary"
                variant="contained"
                className={classes.cancel}
                onClick={cancel}
              >
                Cancel
              </Button>
            </div>
          </CardActions>
        </Card>
      ) : null}
    </div>
  );
};

export default EditUserPassword;
