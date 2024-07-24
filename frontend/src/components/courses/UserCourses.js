import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import jwtDecode from "jwt-decode";
import {
  cleanCompletedCourseMessage,
  cleanReloginStatus,
  cleanUserFetchDataStatus,
  completeCourse,
  fetchMentors,
  fetchUserCourses,
  fetchUserData,
  getAllMentors,
  getCompletedCourseMessage,
  getLoggedUserData,
  getUserCourses,
  getUserToken,
  reLoginUser,
  setUserToken,
  userToken,
} from "../../features/eLearningSlice";
import {
  Card,
  CardActions,
  CardMedia,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  Typography,
  Box,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  card: {
    margin: "auto",
    textAlign: "center",
    marginTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    marginBottom: "20px",
    marginLeft: theme.spacing(2),
    height: "320px",
  },
  title: {
    textAlign: "left",
    marginLeft: "10px",
    marginBottom: "20px !important",
  },
  mentorName: {
    textAlign: "left",
    marginLeft: "10px",
    marginBottom: "20px",
    fontStyle: "italic",
    marginTop: "20px !important",
  },
  displayCoursesContainer: {
    maxHeight: "60vh",
    overflow: "auto",
    paddingBottom: "20px",
  },
}));

const UserCourses = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const userCourses = useSelector(getUserCourses);
  const loggedUser = useSelector(getLoggedUserData);
  const allMentors = useSelector(getAllMentors);
  const completedCourseMessage = useSelector(getCompletedCourseMessage);
  const token = useSelector(getUserToken);

  useEffect(() => {
    if (
      token?.message &&
      Object.keys(loggedUser).length === 0 &&
      token.length !== 12 &&
      token !== "user reloged" &&
      loggedUser !== "signout"
    ) {
      dispatch(userToken());
    }

    if (token?.message) {
      dispatch(reLoginUser(jwtDecode(token.message)._id));
      dispatch(setUserToken("user reloged"));
    }

    if (loggedUser?.relogin) {
      if (loggedUser?.user && loggedUser.user.role === "student") {
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
        dispatch(cleanReloginStatus());
      }
    }

    if (completedCourseMessage?.message) {
      dispatch(cleanCompletedCourseMessage());
      dispatch(fetchUserData(loggedUser.user._id));
    }

    if (loggedUser?.message) {
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
      dispatch(cleanUserFetchDataStatus());
    }
  }, [completedCourseMessage, loggedUser, token]);

  const complete = (id) => {
    const user = {
      id: loggedUser.user._id,
      courseId: id,
    };
    dispatch(completeCourse(user));
  };

  return (
    <Box className={classes.displayCoursesContainer}>
      <Grid container>
        {userCourses?.data && allMentors?.mentors
          ? userCourses.data.map((item) => {
              if (!loggedUser.user.completedCourses.includes(item._id)) {
                return (
                  <Grid item xs={12} md={4} lg={3} xl={2} key={item.title}>
                    <Card className={classes.card}>
                      <Grid container>
                        <Grid item xs={12} md={12} xl={12} lg={12}>
                          <CardMedia
                            component={"img"}
                            src={item.courseImage}
                          ></CardMedia>
                        </Grid>
                        <Grid item xs={12} md={12} lg={12} xl={12}>
                          <Typography variant="h5" className={classes.title}>
                            {item.title}
                          </Typography>{" "}
                          {allMentors.mentors.filter(
                            (mentor) => mentor._id === item.mentorId
                          ).length > 0 &&
                          allMentors.mentors.filter(
                            (mentor) => mentor._id === item.mentorId
                          ).length > 0 ? (
                            <Typography component={"p"}>
                              Mentor:{" "}
                              {`${
                                allMentors.mentors.filter(
                                  (mentor) => mentor._id === item.mentorId
                                )[0].firstName
                              } `}
                              {
                                allMentors.mentors.filter(
                                  (mentor) => mentor._id === item.mentorId
                                )[0].lastName
                              }
                            </Typography>
                          ) : null}
                        </Grid>
                        <Grid item xs={12} md={12} lg={12} xl={12}>
                          <CardActions>
                            <FormControl>
                              <FormControlLabel
                                label="Completed"
                                control={
                                  <Checkbox
                                    onClick={() => complete(item._id)}
                                  />
                                }
                              />
                            </FormControl>
                          </CardActions>
                        </Grid>
                      </Grid>
                    </Card>
                  </Grid>
                );
              }
            })
          : null}
      </Grid>
    </Box>
  );
};

export default UserCourses;
