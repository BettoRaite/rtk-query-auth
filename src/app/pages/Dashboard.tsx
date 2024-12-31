import React, { Fragment, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  userSelector,
  fetchUserBytoken,
  clearState,
} from "@/features/user/userSlice";
import { useNavigate } from "react-router";

const Dashboard = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { authState } = useSelector(userSelector);
  // useEffect(() => {
  //   dispatch(fetchUserBytoken({ token: localStorage.getItem("token") }));
  // }, []);

  // const { username, email } = useSelector(userSelector);

  // useEffect(() => {
  //   if (isError) {
  //     dispatch(clearState());
  //     history.push("/login");
  //   }
  // }, [isError]);

  const onLogOut = () => {
    localStorage.removeItem("token");

    navigate("/login");
  };

  return (
    <div className="container mx-auto">
      {authState === "loading" ? (
        <div>loading</div>
      ) : (
        <Fragment>
          <div className="container mx-auto">
            Welcome back <h3>{"username"}</h3>
          </div>

          <button
            onClick={onLogOut}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Log Out
          </button>
        </Fragment>
      )}
    </div>
  );
};

export default Dashboard;
