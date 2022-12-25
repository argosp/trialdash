import React from "react";
import { Redirect } from "react-router-dom";
import AppLayout from "../AppLayout";

class AuthPage extends React.Component {
  state = {
    isAuthorized: Boolean(localStorage.getItem("uid")),
  };

  render() {
    const { children } = this.props;
    const { isAuthorized } = this.state;

    return isAuthorized ? (
      <AppLayout>{children}</AppLayout>
    ) : (
      <Redirect to="/login" />
    );
  }
}

export default AuthPage;
