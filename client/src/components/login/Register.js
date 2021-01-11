import React, { Component } from "react";
import axios from "axios";
import "./register.scss";
import Fab from "@material-ui/core/Fab";
import CircularProgress from "@material-ui/core/CircularProgress";
import green from "@material-ui/core/colors/green";
import { login } from "../../globalState/actions/authActions";

const Joi = require("joi");
export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailError: "",
      passwordError: "",
      usernameError: "",
      val: "",
      showPassword: false,
      success: false,
      loading: false,
      clicked: false
    };
  }

  componentDidMount = async () => {};
  submit = async () => {
    if (!this.state.loading) {
      await this.setState({
        success: false,
        loading: true,
        clicked: true
      });
    }
    var valid = true;
    const me = this;
    var username = document.getElementById("username");
    var email = document.getElementById("email");
    var password = document.getElementById("password");
    const body = {
      username: username.value,
      email: email.value,
      password: password.value
    };
    Joi.validate(
      { username: body.username },
      {
        username: Joi.string()
          .min(1)
          .max(500)
          .required()
      },
      function(error, value) {
        if (error) {
          valid = false;
          if (value.username === "")
            me.setState({ usernameError: "User name is required" });
          else me.setState({ usernameError: "Invalid Name" });
        } else me.setState({ usernameError: "" });
      }
    );

    Joi.validate(
      { email: body.email },
      {
        email: Joi.string()
          .email()
          .required()
      },
      function(error, value) {
        if (error) {
          valid = false;
          if (value.email === "")
            me.setState({ emailError: "Email is required" });
          else me.setState({ emailError: "Invalid Email" });
        } else me.setState({ emailError: "" });
      }
    );

    Joi.validate(
      { password: body.password },
      {
        password: Joi.string()
          .min(8)
          .required()
      },
      function(error, value) {
        if (error) {
          valid = false;
          if (value.password === "")
            me.setState({ passwordError: "Password is required" });
          else me.setState({ passwordError: "Password is weak" });
        } else me.setState({ passwordError: "" });
      }
    );

    if (valid) {
      try {
        await axios.post("http://localhost:5000/api/users/", body);
        await login(body);
        window.location.reload();
        await this.setState({ success: true, loading: false });
        this.setState({ val: "Successfully Created!" });
      } catch (error) {
        await this.setState({ success: false, loading: false, clicked: false });
        this.state.usernameError = "This username is already in use";
        this.state.emailError = "make sure the email is unique";
        this.setState({ val: "Username or Email are not unique" });
      }
    } else {
      await this.setState({ success: false, loading: false, clicked: false });
      this.setState({ val: "" });
    }
  };

  render() {
    const { loading } = this.state;
    return (
      <div style={{ paddingTop: "0vh" }}>
        <div className="wrapper">
          <div className="page-header" style={{}}>
            <div className="filter" />
            <div className="container">
              <div className="row">
                <div className="col-lg-4 col-sm-6 mr-auto ml-auto">
                  <div
                    className="card card-register"
                    style={{
                      backgroundColor: "#FFFFFF",
                      boxShadow: "0px 3px 20px rgba(0, 0, 0, 0.16)"
                    }}
                  >
                    <h3
                      className="title"
                      style={{
                        fontFamily:
                          "-apple-system, BlinkMacSystemFont, sans-serif",
                        fontSize: "30px",
                        fontWeight: "bold",
                        color: "#223242"
                      }}
                    >
                      {"Register"}
                    </h3>
                    <form id="Register">
                      <input
                        id="username"
                        type="text"
                        placeholder={"Username"}
                        className="form-control"
                      />
                      <br />
                      <label id="Error" className="text-danger">
                        {" "}
                        {this.state.usernameError}
                      </label>
                      <br />
                      <input
                        id="email"
                        type="text"
                        className="form-control"
                        placeholder={"Email"}
                      />
                      <br />
                      <label id="Error" className="text-danger">
                        {" "}
                        {this.state.emailError}
                      </label>
                      <br />
                      <label id="Error" className="text-danger">
                        {" "}
                        {this.state.fullNameError}
                      </label>
                      <br />
                      <input
                        id="password"
                        type="password"
                        placeholder={"Password"}
                        className="form-control"
                      />
                      <br />
                      <label id="Error" className="text-danger">
                        {" "}
                        {this.state.passwordError}
                      </label>
                    </form>
                    <div
                      key="divv"
                      className="CircularIntegration-root-241"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <div
                        key="divvvv"
                        className="CircularIntegration-wrapper-242"
                        style={{
                          marginRight: "240px",
                          marginTop: "12px",
                          display: "block",
                          margin: "0 auto",
                          position: "relative"
                        }}
                      >
                        {!this.state.clicked ? (
                          <Fab
                            variant="extended"
                            size="large"
                            color="primary"
                            style={{
                              color: "#FFFFFF",
                              height: "31px",
                              width: "107px",
                              fontSize: "13px",
                              boxShadow: "none",
                              marginRight: "240px",
                              marginTop: "6px",
                              display: "block",
                              margin: "0 auto"
                            }}
                            aria-label="Delete"
                            onClick={this.submit}
                          >
                            {"Register"}
                          </Fab>
                        ) : (
                          <CircularProgress
                            style={{
                              marginTop: "6px",
                              marginRight: "240px",
                              display: "block",
                              margin: "0 auto"
                            }}
                          />
                        )}
                        {loading && (
                          <CircularProgress
                            size={68}
                            className="CircularIntegration-fabProgress-909"
                            style={{
                              color: green[500],
                              position: "absolute",
                              top: -6,
                              left: -6,
                              zIndex: 1
                            }}
                          />
                        )}
                      </div>
                    </div>
                    <br />
                    <br />
                    <label id="Success" className="text-danger">
                      {this.state.val}
                    </label>
                    <br />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
