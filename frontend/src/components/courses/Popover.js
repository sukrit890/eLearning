import * as React from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { Card, CardContent, Grid } from "@mui/material";

export default function MouseOverPopover({
  title,
  styleTitle,
  loggedUser,
  styleEnrolledInCourseMessage,
  courses,
  styleCard,
  stylePopupWindow,
  id,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [courseToDisplay, setCourseToDisplay] = useState([]);

  const handlePopoverOpen = (event, title) => {
    setAnchorEl(event.currentTarget);
    setCourseToDisplay(courses.data.filter((item) => item.title === title));
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div className={stylePopupWindow}>
      <Typography
        variant="h4"
        className={styleTitle}
        style={{
          wordBreak: "break-word",
          width: "100%",
          wordWrap: "break-word",
          marginBottom: "0px",
          textAlign: "left",
          marginBottom: "10px",
        }}
        aria-owns={open ? "mouse-over-popover" : undefined}
        aria-haspopup="true"
        onMouseEnter={(event) => handlePopoverOpen(event, title)}
        onMouseLeave={handlePopoverClose}
      >
        {title}
        <span className={styleEnrolledInCourseMessage}>
          {loggedUser?.user && loggedUser.user.enrolledInCourses.includes(id)
            ? `(enrolled)`
            : null}
        </span>
      </Typography>
      <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: "none",
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Card onMouseLeave={handlePopoverClose} className={styleCard}>
          <CardContent>
            {loggedUser?.user &&
            courseToDisplay?._id &&
            loggedUser.user.enrolledInCourses.includes(
              courseToDisplay[0]._id
            ) ? (
              <Typography
                component={"p"}
                className={styleEnrolledInCourseMessage}
                style={{
                  width: "600px",
                  textAlign: "center",
                }}
              >
                You are already enrolled into this course
              </Typography>
            ) : null}
            <Typography
              variant="h4"
              component={"p"}
              style={{ marginBottom: "20px" }}
            >
              What will you learn
            </Typography>
            {courseToDisplay[0]?.description
              ? courseToDisplay[0].description.split(".").map((item) => {
                  return (
                    <Typography
                      component="p"
                      key={item}
                      style={{
                        wordBreak: "break-word",
                        marginRight: "50px",
                        textAlign: "left",
                      }}
                    >
                      {item !== "" ? item : null}
                    </Typography>
                  );
                })
              : null}
          </CardContent>
        </Card>
      </Popover>
    </div>
  );
}
