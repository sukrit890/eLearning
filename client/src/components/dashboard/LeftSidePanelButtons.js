import { Button, ButtonGroup } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { makeStyles } from "@mui/styles";

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

const ButtonGroupWithIcons = ({ buttons, icons, clickEvents }) => {
  const classes = useStyles();

  return (
    <ButtonGroup orientation="vertical">
      {buttons.map((item, index) => {
        return (
          <Button
            key={index}
            onClick={clickEvents[index]}
            color="primary"
            className={classes.buttons}
            startIcon={
              <FontAwesomeIcon icon={icons[index]} className={classes.icons} />
            }
          >
            {item}
          </Button>
        );
      })}
    </ButtonGroup>
  );
};

export default ButtonGroupWithIcons;
