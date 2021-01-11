import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import { login } from "../../globalState/actions/authActions";
import "./login.scss";
import parseJwt from "../../helpers/decryptAuthToken";
import CircularProgress from "@material-ui/core/CircularProgress";
import Register from "./Register";

class Login extends Component {
  state = {
    email: "",
    password: "",
    id: "",
    showPassword: false,
    forgot: false,
    register: false,
    res: "",
    loggedIn: false,
    lang: "",
    clicked: false
  };
  handleSubmit = async () => {
    await this.setState({ clicked: true });
    const req = {
      email: this.state.email,
      username: this.state.email,
      password: this.state.password
    };
    try {
      const res = await login(req);
      this.setState({ loggedIn: true });
      this.setState({ res: res });
    } catch (error) {
      document.getElementById("Error").style.display = "inline";
    }
    await this.setState({ clicked: false });
  };
  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  async componentDidMount() {
    try {
      const id = await parseJwt(localStorage.jwtToken).id;
      if (id) this.setState({ loggedIn: true });
      else this.setState({ loggedIn: false });
    } catch {
      this.setState({ loggedIn: false });
    }
  }

  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };

  render() {
    if (this.state.loggedIn) {
      window.location.reload();
    }
    const styles = {
      error: {
        display: "none"
      },
      label: {
        width: "35%",
        margin: "auto"
      }
    };
    if (this.state.register) {
      return (
        <div>
          <Register />
        </div>
      );
    } else {
      return (
        <div>
          <div style={{ paddingTop: "5vh" }}>
            <div className="wrapper">
              <div className="page-header">
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
                          {"Welcome Back!"}
                        </h3>
                        <h5
                          style={{
                            marginTop: "5px",
                            fontFamily:
                              "-apple-system, BlinkMacSystemFont, sans-serif",
                            fontSize: "14px",
                            fontWeight: "lighter",
                            color: "#222529",
                            textAlign: "center"
                          }}
                        >
                          {"Login back to your dashboard"}
                        </h5>
                        <form className="login-form">
                          <input
                            type="text"
                            id="email"
                            onChange={this.handleChange}
                            className="form-control"
                            placeholder={"email"}
                            autoComplete="email"
                          />
                          <br />
                          <input
                            type="password"
                            id="password"
                            onChange={this.handleChange}
                            className="form-control"
                            placeholder={"password"}
                            autoComplete="current-password"
                          />
                          <br />
                          <label
                            id="Error"
                            style={styles.error}
                            className="text-danger"
                          >
                            {" "}
                            {"Wrong Email or Password"}
                          </label>
                          <br />
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
                              onClick={this.handleSubmit}
                            >
                              {"Login"}
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
                        </form>
                        <br />
                        <div className="register">
                          <Button
                            variant="text"
                            style={{
                              fontFamily:
                                "-apple-system, BlinkMacSystemFont, sans-serif",
                              color: "#0000FF",
                              fontSize: "11px",
                              fontWeight: "bold"
                            }}
                            size="small"
                            onClick={() => {
                              this.setState({ register: true });
                            }}
                          >
                            {"Register?"}{" "}
                          </Button>
                        </div>
                        <br />
                        <br />
                      </div>
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
}

export default Login;
