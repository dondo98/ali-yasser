import React, { Component } from "react";
import axios from "axios";
import Article from "./Article";
import parseJwt from "../helpers/decryptAuthToken";
import CircularProgress from "@material-ui/core/CircularProgress";

class RecommendedArticles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      RecommendedArticles: [],
      done: false
    };
  }

  async componentDidMount() {
    if (!localStorage.jwtToken) {
      alert("You must login!");
      return;
    }
    try {
      await this.setState({ id: parseJwt(localStorage.jwtToken).id });
      const res = await axios.get(
        `http://localhost:5000/api/users/recommend/${this.state.id}`
      );
      this.setState({
        RecommendedArticles:
          res.data.data[
            Math.min(
              Math.max(0, Math.floor(Math.random() * res.data.data.length - 1)),
              res.data.data.length - 1
            )
          ].articles
      });
      await this.setState({ done: true });
    } catch {
      this.setState({ id: null });
    }
  }

  render() {
    if (this.state.done) {
      return (
        <div>
          <ul style={{ display: "flex", flexWrap: "wrap", paddingTop: "10vh" }}>
            {this.state.RecommendedArticles.map(article => (
              <Article key={article._id} article={article} />
            ))}
          </ul>
        </div>
      );
    } else {
      return (
        <div>
          <CircularProgress style={{ marginTop: "25vh", marginLeft: "45vw" }} />
          <h3 style={{ marginLeft: "45vw" }}>Fetching Data</h3>
        </div>
      );
    }
  }
}
export default RecommendedArticles;
