import { useSelector } from "react-redux";
import { getLoggedUserData } from "../../features/eLearningSlice";
import MentorCourses from "../courses/MentorCourses";
import UserCourses from "../courses/UserCourses";

const DashboardRightPanel = () => {
  const loggedUser = useSelector(getLoggedUserData);

  return (
    <>
      {loggedUser?.user && loggedUser.user.role === "student" ? (
        <UserCourses />
      ) : null}
      {loggedUser?.user && loggedUser.user.role === "mentor" ? (
        <MentorCourses />
      ) : null}
    </>
  );
};

export default DashboardRightPanel;
