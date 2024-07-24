import { useDispatch, useSelector } from "react-redux";
import {
  getCloseAccountModalStatus,
  setCloseAccountForm,
  setCloseAccountModal,
  setEditUserPasswordForm,
  setEditUserProfileForm,
} from "../../features/eLearningSlice";
import {
  DialogContent,
  DialogTitle,
  Button,
  Box,
  Modal,
  ButtonGroup,
  Typography,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  textAlign: "center",
};

const DeleteAccountModal = () => {
  const dispatch = useDispatch();
  const closeAccountModalStatus = useSelector(getCloseAccountModalStatus);

  const redirectToCloseAccountForm = () => {
    dispatch(setCloseAccountModal(false));
    dispatch(setEditUserProfileForm(false));
    dispatch(setEditUserPasswordForm(false));
    dispatch(setCloseAccountForm(true));
  };

  const cancel = () => {
    dispatch(setCloseAccountModal(false));
    dispatch(setCloseAccountForm(false));
  };

  const handleClose = () => dispatch(setCloseAccountModal(false));

  return (
    <Modal
      open={closeAccountModalStatus}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <DialogTitle>DELETE ACCOUNT</DialogTitle>
        <DialogContent>
          <FontAwesomeIcon
            icon={faTriangleExclamation}
            style={{ fontSize: "60px" }}
          />
        </DialogContent>
        <DialogContent>
          <Typography variant="h5" color="error">
            Are you sure?
          </Typography>
        </DialogContent>
        <ButtonGroup>
          <Button
            variant="contained"
            style={{ margin: "0 auto !important", minWidth: "120px" }}
            color="primary"
            autoFocus="autoFocus"
            onClick={redirectToCloseAccountForm}
          >
            OK
          </Button>
          <Button
            style={{ minWidth: "120px", marginLeft: "10px" }}
            color="primary"
            autoFocus="autoFocus"
            onClick={cancel}
            variant="contained"
          >
            Cancel
          </Button>
        </ButtonGroup>
      </Box>
    </Modal>
  );
};

export default DeleteAccountModal;
