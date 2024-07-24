import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  cleanStore,
  setCloseAccountForm,
  setCloseAccountModal,
  setDeleteAccountModal,
  setEditUserPasswordForm,
  setEditUserProfileForm,
  setLoggedUserStatus,
  signoutUser,
} from "../../features/eLearningSlice";
import { Button, ButtonGroup } from "@mui/material";
import DropdownButtons from "../utils/DropdownButtons";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  notSmallScreens: {
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
}));

const EditUserDataButtons = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [anchorElStatistics, setAnchorElStatistics] = useState(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const signout = () => {
    dispatch(signoutUser());
    dispatch(setLoggedUserStatus());
    window.location.reload()
    navigate("/");
  };

  const editProfile = () => {
    dispatch(setEditUserProfileForm(true));
    dispatch(setCloseAccountModal(false));
    dispatch(setEditUserPasswordForm(false));
    dispatch(setCloseAccountForm(false));
  };

  const editPassword = () => {
    dispatch(setCloseAccountForm(false));
    dispatch(setCloseAccountModal(false));
    dispatch(setEditUserProfileForm(false));
    dispatch(setEditUserPasswordForm(true));
  };

  const deleteAccount = () => {
    dispatch(setEditUserProfileForm(false));
    dispatch(setEditUserPasswordForm(false));
    dispatch(setCloseAccountModal(true));
  };

  const items = ["Edit Profile", "New Password", "Delete Account"];
  const clickEvents = [editProfile, editPassword, deleteAccount];

  return (
    <ButtonGroup className={classes.editProfileButtons}>
      <Button variant="contained" color="primary" onClick={handleClick}>
        Profile
      </Button>

      <DropdownButtons
        items={items}
        anchorEl={anchorEl}
        open={open}
        handleClose={handleClose}
        clickEvents={clickEvents}
      />
      <Button variant="contained" color="primary" onClick={signout}>
        Logout
      </Button>
    </ButtonGroup>
  );
};

export default EditUserDataButtons;
