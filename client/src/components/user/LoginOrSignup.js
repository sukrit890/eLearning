import { useSelector } from "react-redux";
import {
  getSigninUserFormStatus,
  getSignupUserFormStatus,
} from "../../features/eLearningSlice";
import { Grid, Card, CardMedia } from "@mui/material";
import Login from "./Login";
import Signup from "./Signup";
import eLearningPlatformImage from "../../assets/mainPage.jpeg";

const LoginOrSignup = () => {
  const displayLoginForm = useSelector(getSigninUserFormStatus);
  const displaySignupForm = useSelector(getSignupUserFormStatus);

  return (
    <Grid container justifyContent={"center"}>
      {!displayLoginForm && !displaySignupForm ? (
        <Grid item xs={12} md={8} lg={8} xl={6} style={{ marginTop: "5%" }}>
          <Card>
            <CardMedia
              component="img"
              image={eLearningPlatformImage}
              style={{
                margin: "auto",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            />
          </Card>
        </Grid>
      ) : null}

      {displayLoginForm ? <Login /> : null}
      {displaySignupForm ? <Signup /> : null}
    </Grid>
  );
};

export default LoginOrSignup;
