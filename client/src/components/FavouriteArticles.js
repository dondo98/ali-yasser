import React, { Component } from "react";
import axios from "axios";
import Article from "./Article";
import parseJwt from "../helpers/decryptAuthToken";
import CircularProgress from "@material-ui/core/CircularProgress";

class FavouriteArticles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      FavouriteArticles: [],
      done: false
    };
  }

  async componentWillMount() {
    if (!localStorage.jwtToken) {
      alert("You must login!");
      return;
    }
    try {
      await this.setState({ id: parseJwt(localStorage.jwtToken).id });
      const res = await axios.get(
        `http://localhost:5000/api/users/favouriteArticles/${this.state.id}`
      );
      await this.setState({
        FavouriteArticles: res.data.data
      });
      await this.setState({ done: true });
    } catch {
      this.setState({ id: null });
    }
  }

  render() {
    if (this.state.done) {
      return (
        <ul style={{ display: "flex", flexWrap: "wrap", paddingTop: "10vh" }}>
          {this.state.FavouriteArticles.map(article => (
            <Article key={article._id} article={article} />
          ))}
        </ul>
      );
    } else {
      return (
        <div>
          <CircularProgress style={{ marginTop: "36vh", marginLeft: "5vw" }} />
          <h3 style={{ marginLeft: "5vw" }}>Fetching Data</h3>
        </div>
      );
    }
  }
}
export default FavouriteArticles;
