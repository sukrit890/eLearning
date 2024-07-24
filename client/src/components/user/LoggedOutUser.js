import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { cleanStore } from "../../features/eLearningSlice";

const LoggedOutUser = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(cleanStore());
  });

  return <h1>You have successfully logged out</h1>;
};

export default LoggedOutUser;
