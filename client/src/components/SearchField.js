import React, { Component } from "react";
import parseJwt from "../helpers/decryptAuthToken";
import { logout } from "../globalState/actions/authActions";
import { Redirect } from "react-router-dom";
import Articles from "./Articles";
import RecommendedArticles from "./RecommendedArticles";
import FavoriteArticles from "./FavouriteArticles";
import Login from "./login/Login";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import { fade, withStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import Badge from "@material-ui/core/Badge";
import FavoriteIcon from "@material-ui/icons/Favorite";
import SearchIcon from "@material-ui/icons/Search";
import Fab from "@material-ui/core/Fab";
import "./heroPage.css";

const styles = theme => ({
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block"
    }
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto"
    }
  },
  searchIcon: {
    width: theme.spacing(7),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  inputRoot: {
    color: "inherit"
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: 200
    }
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex"
    }
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none"
    }
  }
});

class SearchField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: [],
      done: false,
      remove: false,
      clicked: false,
      recommendedDone: false,
      login: false,
      favorite: false,
      home: false
    };
  }
  async componentDidMount() {
    this.setState({ searchText: [] });
    this.setState({ done: false });
    this.setState({ remove: false });
    this.setState({ clicked: false });
    this.setState({ againClicked: false });
    this.setState({ recommendedDone: false });
    this.setState({ login: false });
    try {
      await this.setState({ id: parseJwt(localStorage.jwtToken).id });
    } catch {
      this.setState({ id: null });
    }
    this.effect = window.VANTA.BIRDS({
      el: "#hero",
      birdSize: 1.7,
      wingSpan: 32.0,
      speedLimit: 6.0,
      alignment: 38.0,
      cohesion: 45.0
    });
  }
  componentWillUnmount() {
    if (this.effect) this.effect.destroy();
  }

  keyPressed = event => {
    if (event.key === "Enter") {
      this.setState({ searchText: [event.target.value] });
      this.setState({ done: true });
      this.setState({ remove: true });
      this.setState({ clicked: false });
      this.setState({ againClicked: false });
      this.setState({ favorite: false });
      this.setState({ home: false });
      this.setState({ recommendedDone: false });
    } else {
      this.setState({ remove: false });
    }
  };

  handleLogin = () => {
    if (this.state.id) {
      logout();
      window.location.reload();
    } else {
      if (!this.state.login) {
        this.setState({ home: false });
        this.setState({ login: true });
      }
    }
  };

  handleFavorite = () => {
    this.setState({ favorite: true });
    this.setState({ searchText: [] });
    this.setState({ done: false });
    this.setState({ remove: false });
    this.setState({ clicked: false });
    this.setState({ againClicked: false });
    this.setState({ recommendedDone: false });
    this.setState({ login: false });
    this.setState({ home: false });
  };

  handleHome = () => {
    this.setState({ home: true });
    this.setState({ searchText: [] });
    this.setState({ done: false });
    this.setState({ remove: false });
    this.setState({ clicked: false });
    this.setState({ againClicked: false });
    this.setState({ recommendedDone: false });
    this.setState({ login: false });
    this.setState({ favorite: false });
    window.location.reload();
  };

  onClick = event => {
    if (!this.state.clicked) {
      this.setState({ clicked: true });
      this.setState({ againClicked: false });
    } else {
      this.setState({ clicked: false });
      this.setState({ againClicked: true });
    }

    this.setState({ remove: false });
  };
  handleButtonClick = () => {
    var devID =
      document.getElementById("cc").getBoundingClientRect().top +
      window.scrollY;
    window.scrollBy({ top: devID, behavior: "smooth" });
  };
  render() {
    const { classes } = this.props;
    if (!this.state.id && this.state.login === false) {
      return (
        <div className={classes.grow}>
          <AppBar position="static">
            <Toolbar>
              <Button
                color="inherit"
                onClick={this.handleHome}
                style={{ color: "#FF69B4" }}
              >
                News App
              </Button>
              <div className={classes.search}>
                <div className={classes.searchIcon}>
                  <SearchIcon />
                </div>
                <InputBase
                  disabled={this.state.id ? false : true}
                  placeholder="Search…"
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput
                  }}
                  inputProps={{ "aria-label": "search" }}
                  onKeyPress={this.keyPressed}
                />
              </div>
              <div className={classes.grow} />
              <div className={classes.sectionDesktop}>
                <IconButton
                  disabled={this.state.id ? false : true}
                  color="inherit"
                  onClick={this.handleFavorite}
                >
                  <Badge color="secondary">
                    <FavoriteIcon />
                  </Badge>
                </IconButton>
                <Button color="inherit" onClick={this.handleLogin}>
                  {this.state.id ? "Logout" : "Login"}
                </Button>
              </div>
            </Toolbar>
          </AppBar>
          <div className="HeroAndHome">
            <div id="hero" style={{ height: "100vh" }}>
              {/* {navbar} */}

              <div className="createNewsApp" id="first">
                <p className="createNewsAppSpan">
                  Get all the news you need
                  <br />
                  with just one search
                </p>

                <p className="createNews ">
                  You are one search away from getting all the news you need
                  <br />
                  Register now!
                </p>

                <div
                  style={{
                    width: "100px",
                    alignSelf: "left",
                    marginLeft: "13.8vw"
                  }}
                >
                  <Fab
                    color="primary"
                    variant="extended"
                    size="medium"
                    style={{
                      boxShadow: "none",
                      marginTop: "7px"
                    }}
                    aria-label="Delete"
                    onClick={async () => {
                      this.setState({ login: true });
                    }}
                  >
                    Login
                  </Fab>
                </div>
              </div>
              <div className="arrow">
                <button
                  id="buttonArrow"
                  onClick={this.handleButtonClick}
                  style={{
                    backgroundColor: "Transparent",
                    backgroundRepeat: "no-repeat",
                    border: "none",
                    cursor: "pointer",
                    overflow: "hidden",
                    outline: "none"
                  }}
                >
                  <svg
                    className="Path_7_A1_Path_2"
                    viewBox="8.719 12.382 59.679 33.831"
                    id="arrow"
                  >
                    <path
                      id="Path_7_A1_Path_2"
                      d="M 61.59608840942383 13.55010986328125 L 38.55812454223633 36.60403823852539 L 15.5201530456543 13.55010986328125 C 13.96456623077393 11.99258518218994 11.44176864624023 11.99258518218994 9.885747909545898 13.54968070983887 C 8.329729080200195 15.10677909851074 8.329733848571777 17.63132476806641 9.885747909545898 19.18841934204102 L 35.72918319702148 45.04890060424805 C 36.47779846191406 45.80119323730469 37.49721908569336 46.22072982788086 38.55812454223633 46.21315383911133 C 39.61861038208008 46.21848678588867 40.63718795776367 45.79928970336914 41.3870735168457 45.04889297485352 L 67.23007965087891 19.1879940032959 C 68.78652191162109 17.63132476806641 68.78652191162109 15.10677909851074 67.23049163818359 13.54968738555908 C 65.67447662353516 11.99259185791016 63.15168762207031 11.99258804321289 61.59566116333008 13.54968070983887 Z"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="all" id="second">
              <div id="cc" />
              <div className="homePage2">
                <div className="homePage2Div1">
                  <div className="homePageContainers">
                    <h1 className="homePageHeader">
                      Forget about navigating through multiple newspapers.
                    </h1>
                    <p className="homePagePar">
                      No more wasting time looking for your desired article to
                      read. Keep up with the latest news from the comfort of one
                      site using our News App.
                    </p>
                  </div>
                </div>
                <div className="homePage2Div2">
                  <div className="homePageContainers">
                    <h1 className="homePageHeader">
                      Get your recommended articles
                    </h1>
                    <p className="homePagePar">
                      Why check more than one website when you can access them
                      all from just one website?
                    </p>
                  </div>
                </div>
                <div className="homePage2Div1">
                  <div className="homePageContainers">
                    <h1 className="homePageHeader">
                      View your favorite articles with just one click.
                    </h1>
                    <p className="homePagePar">
                      Want to know about the latest cars? Want to keep up with
                      politics? Want that amazing recipe?
                      <br />
                      You can do all that and more through our app!
                      <br />
                    </p>
                  </div>
                </div>
                <div className="homePage2Div3">
                  <div className="homePageContainers">
                    <h1 className="homePageHeader2">Start Now</h1>
                    <p className="homePagePar2">
                      You are a click away from getting all the news you need!
                    </p>
                    <Fab
                      color="primary"
                      variant="extended"
                      size="medium"
                      style={{
                        boxShadow: "none",
                        marginTop: "7px"
                      }}
                      aria-label="Delete"
                      onClick={async () => {
                        this.setState({ login: true });
                      }}
                    >
                      Login
                    </Fab>
                  </div>
                </div>
                <div className="NewsAppCopyRight_A0_Text_16">
                  <p className="newsAppCopyRight">News App &copy;</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    if (
      (!(this.state.remove === true && this.state.done === true) ||
        this.state.clicked === true ||
        this.state.againClicked === true) &&
      this.state.favorite === false &&
      this.state.login === false
    ) {
      return (
        <div className={classes.grow}>
          {this.state.home ? <Redirect to="/" /> : null}
          <AppBar position="static">
            <Toolbar>
              <Button
                color="inherit"
                onClick={this.handleHome}
                style={{ color: "red" }}
              >
                News App
              </Button>
              <div className={classes.search}>
                <div className={classes.searchIcon}>
                  <SearchIcon />
                </div>
                <InputBase
                  disabled={this.state.id ? false : true}
                  placeholder="Search…"
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput
                  }}
                  inputProps={{ "aria-label": "search" }}
                  onKeyPress={this.keyPressed}
                />
              </div>
              <div className={classes.grow} />
              <div className={classes.sectionDesktop}>
                <IconButton
                  disabled={this.state.id ? false : true}
                  color="inherit"
                  onClick={this.handleFavorite}
                >
                  <Badge color="secondary">
                    <FavoriteIcon />
                  </Badge>
                </IconButton>
                <Button color="inherit" onClick={this.handleLogin}>
                  {this.state.id ? "Logout" : "Login"}
                </Button>
              </div>
            </Toolbar>
          </AppBar>
          <ul style={{ display: "flex", flexWrap: "wrap", paddingTop: "10vh" }}>
            {<RecommendedArticles key={1} />}
            {!this.state.recommendedDone
              ? this.setState({ recommendedDone: true })
              : null}
          </ul>
        </div>
      );
    } else if (
      this.state.clicked === false &&
      this.state.againClicked === false &&
      this.state.favorite === false &&
      this.state.login === false
    ) {
      return (
        <div className={classes.grow}>
          {this.state.home ? <Redirect to="/" /> : null}
          <AppBar position="static">
            <Toolbar>
              <Button color="inherit" onClick={this.handleHome}>
                News App
              </Button>
              <div className={classes.search}>
                <div className={classes.searchIcon}>
                  <SearchIcon />
                </div>
                <InputBase
                  disabled={this.state.id ? false : true}
                  placeholder="Search…"
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput
                  }}
                  inputProps={{ "aria-label": "search" }}
                  onKeyPress={this.keyPressed}
                />
              </div>
              <div className={classes.grow} />
              <div className={classes.sectionDesktop}>
                <IconButton
                  disabled={this.state.id ? false : true}
                  color="inherit"
                  onClick={this.handleFavorite}
                >
                  <Badge color="secondary">
                    <FavoriteIcon />
                  </Badge>
                </IconButton>
                <Button color="inherit" onClick={this.handleLogin}>
                  {this.state.id ? "Logout" : "Login"}
                </Button>
              </div>
            </Toolbar>
          </AppBar>
          <ul style={{ display: "flex", flexWrap: "wrap", paddingTop: "10vh" }}>
            {this.state.searchText.map(text => (
              <Articles key={1} searchText={text} />
            ))}
          </ul>
        </div>
      );
    } else if (this.state.favorite === true) {
      return (
        <div className={classes.grow}>
          {this.state.home ? <Redirect to="/" /> : null}
          <AppBar position="static">
            <Toolbar>
              <Button color="inherit" onClick={this.handleHome}>
                News App
              </Button>
              <div className={classes.search}>
                <div className={classes.searchIcon}>
                  <SearchIcon />
                </div>
                <InputBase
                  disabled={this.state.id ? false : true}
                  placeholder="Search…"
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput
                  }}
                  inputProps={{ "aria-label": "search" }}
                  onKeyPress={this.keyPressed}
                />
              </div>
              <div className={classes.grow} />
              <div className={classes.sectionDesktop}>
                <IconButton
                  disabled={this.state.id ? false : true}
                  color="inherit"
                  onClick={this.handleFavorite}
                >
                  <Badge color="secondary">
                    <FavoriteIcon style={{ color: "FF0000" }} />
                  </Badge>
                </IconButton>
                <Button color="inherit" onClick={this.handleLogin}>
                  {this.state.id ? "Logout" : "Login"}
                </Button>
              </div>
            </Toolbar>
          </AppBar>
          <FavoriteArticles />
        </div>
      );
    } else if (this.state.login === true) {
      return (
        <div className={classes.grow}>
          {this.state.home ? <Redirect to="/" /> : null}
          <AppBar position="static">
            <Toolbar>
              <Button color="inherit" onClick={this.handleHome}>
                News App
              </Button>
              <div className={classes.search}>
                <div className={classes.searchIcon}>
                  <SearchIcon />
                </div>
                <InputBase
                  disabled={this.state.id ? false : true}
                  placeholder="Search…"
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput
                  }}
                  inputProps={{ "aria-label": "search" }}
                  onKeyPress={this.keyPressed}
                />
              </div>
              <div className={classes.grow} />
              <div className={classes.sectionDesktop}>
                <IconButton
                  disabled={this.state.id ? false : true}
                  color="inherit"
                  onClick={this.handleFavorite}
                >
                  <Badge color="secondary">
                    <FavoriteIcon />
                  </Badge>
                </IconButton>
                <Button color="inherit" onClick={this.handleLogin}>
                  {this.state.id ? "Logout" : "Login"}
                </Button>
              </div>
            </Toolbar>
          </AppBar>
          <Login />
        </div>
      );
    }
  }
}

export default withStyles(styles)(SearchField);
