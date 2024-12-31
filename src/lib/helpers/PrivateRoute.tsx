import React from "react";
import { redirect, Route } from "react-router";

export const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      localStorage.getItem("token") ? (
        <Component {...props} />
      ) : (
        redirect("/signup")
      )
    }
  />
);
