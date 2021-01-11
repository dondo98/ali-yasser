import React, { Component } from "react";
import axios from "axios";
import Article from "./Article";
import parseJwt from "../helpers/decryptAuthToken";
import CircularProgress from "@material-ui/core/CircularProgress";

class Articles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      finished: false
    };
  }

  async componentDidMount() {
    if (!localStorage.jwtToken) {
      alert("You must login!");
      return;
    }
    try {
      await this.setState({ id: parseJwt(localStorage.jwtToken).id });
      const res = await axios.post(
        `http://localhost:5000/api/users/search/${this.state.id}/${this.props.searchText}`
      );
      this.setState({ articles: res.data.data.articles });
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
            {this.state.articles.map(article => (
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
export default Articles;
