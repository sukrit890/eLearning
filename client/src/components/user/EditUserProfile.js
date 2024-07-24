import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import jwtDecode from "jwt-decode";
import {
  updateUserData,
  getUserToken,
  getLoggedUserData,
  uploadImage,
  getUploadUserImageStatus,
  getUpdateUserStatus,
  cleanUserUpdateMessage,
  getUserToEdit,
  setEditUserProfileForm,
  fetchUserData,
  cleanUploadImageStatus,
  fetchUsers,
  updateUserDataByAdmin,
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
  ButtonGroup,
} from "@mui/material";
import userImagePlaceholder from "../../assets/userImgPlaceholder.png";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 600,
    margin: "auto",
    textAlign: "center",
    marginTop: theme.spacing(10),
    paddingBottom: theme.spacing(2),
    paddingRight: theme.spacing(2),
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
    minWidth: "120px",
    marginRight: theme.spacing(2),
  },
  cancel: {
    marginBottom: theme.spacing(2),
    minWidth: "120px",
  },
  signin: {
    margin: "auto",
    marginBottom: theme.spacing(1),
  },
  userImagePlaceholder: {
    width: 130,
    marginTop: "20px",
  },
  uploadPhoto: {
    minWidth: "125px",
  },
}));
const EditProfile = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const loggedUser = useSelector(getLoggedUserData);
  const token = useSelector(getUserToken);
  const updateUserStatus = useSelector(getUpdateUserStatus);
  const uploadUserImageStatus = useSelector(getUploadUserImageStatus);
  const userToEdit = useSelector(getUserToEdit);

  const navigate = useNavigate();
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    error: "",
  });
  useEffect(() => {
    if (Object.keys(loggedUser).length === 0) {
      navigate("/dashboard");
    }

    setValues({
      email: userToEdit.email,
      firstName: userToEdit.firstName,
      lastName: userToEdit.lastName,
    });

    if (updateUserStatus?.message) {
      dispatch(cleanUploadImageStatus());
      dispatch(cleanUserUpdateMessage());

      if (userToEdit._id === loggedUser.user._id) {
        dispatch(fetchUserData(loggedUser.user._id));
      }

      if (loggedUser.user.role === "admin") {
        const users = {
          firstItem: 0,
          lastItem: 12,
        };
        if (userToEdit._id === loggedUser.user._id) {
          dispatch(setEditUserProfileForm(false));
          navigate("/dashboard");
        } else {
          dispatch(fetchUsers(users));
          navigate("/admin/users");
        }
      } else {
        dispatch(setEditUserProfileForm(false));
        navigate("/dashboard");
      }
    }
  }, [updateUserStatus, loggedUser]);

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const clickSubmit = () => {
    const user = {
      param: userToEdit._id,
      data: {
        firstName: values.firstName || undefined,
        lastName: values.lastName || undefined,
        email: values.email || undefined,
        token: token.message,
        userImage: uploadUserImageStatus.imageUrl,
      },
    };

    if (userToEdit._id !== loggedUser.user._id) {
      dispatch(updateUserDataByAdmin(user));
    } else {
      dispatch(updateUserData(user));
    }
  };

  const cancel = () => {
    if (loggedUser.user.role === "admin") {
      dispatch(cleanUploadImageStatus());
      navigate("/admin/users");
    } else {
      dispatch(cleanUploadImageStatus());
      dispatch(setEditUserProfileForm(false));
    }
  };

  const uploadPhoto = () => {
    document.getElementById("userImage").click();
  };

  const handleUpload = (event) => {
    let formData = new FormData();

    formData.append(
      "userImage",
      event.target.files[0],
      `userImage${userToEdit._id}-${Date.now()}.${
        event.target.files[0].name.split(".")[1]
      }`
    );
    dispatch(uploadImage(formData));
  };

  return (
    <>
      {loggedUser?.user && loggedUser.user.firstName ? (
        <Card className={classes.card}>
          <input
            type="file"
            style={{ display: "none" }}
            id="userImage"
            onChange={handleUpload}
          />
          <Grid container justifyContent="center">
            <Grid item xs={12} md={8} lg={8} xl={8}>
              <CardContent>
                <TextField
                  id="firstName"
                  label="First name"
                  className={classes.textField}
                  value={values.firstName ? values.firstName : ""}
                  onChange={handleChange("firstName")}
                  margin="normal"
                />
                <br />

                <TextField
                  id="lastName"
                  label="Last name"
                  className={classes.textField}
                  value={values.lastName ? values.lastName : ""}
                  onChange={handleChange("lastName")}
                  margin="normal"
                />
                <br />

                <TextField
                  id="email"
                  label="Email"
                  className={classes.textField}
                  value={values.email ? values.email : ""}
                  onChange={handleChange("email")}
                  margin="normal"
                />

                <br />
                <br />

                {updateUserStatus?.error && (
                  <Typography component="p" color="error">
                    <Icon color="error" className={classes.error}></Icon>
                    {updateUserStatus.error}
                  </Typography>
                )}
              </CardContent>

              <CardActions>
                <div style={{ margin: "0 auto" }}>
                  <ButtonGroup>
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={clickSubmit}
                      className={classes.save}
                      style={{ marginRight: "60px" }}
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
                  </ButtonGroup>
                </div>
              </CardActions>
            </Grid>
            <Grid item xs={12} md={2} lg={2} xl={2}>
              <img
                src={
                  uploadUserImageStatus.imageUrl
                    ? uploadUserImageStatus.imageUrl
                    : userToEdit?.userImage
                    ? userToEdit.userImage
                    : userImagePlaceholder
                }
                className={classes.userImagePlaceholder}
                alt="Placeholder"
              ></img>

              {uploadUserImageStatus?.error ? (
                <Typography component="p" color="error">
                  {uploadUserImageStatus.error}
                </Typography>
              ) : null}

              <br />
              <br />
              <Button
                variant="contained"
                color="primary"
                className={classes.uploadPhoto}
                onClick={uploadPhoto}
              >
                Upload photo
              </Button>
            </Grid>
          </Grid>
        </Card>
      ) : (
        ""
      )}
    </>
  );
};

export default EditProfile;
