import axios from "axios";

import setAuthToken from "../../helpers/setAuthToken";

export const logout = () => {
  var token;
  localStorage.setItem("jwtToken", token);
  setAuthToken(token);
};

export const login = async userData => {
  var user, token;
  let userType = "";
  user = await axios.post(`http://localhost:5000/api/users/login`, userData);
  if (user.data.data) {
    token = user.data.data;
    userType = "user";
  }
  if (!token) throw new Error("Wrong Email or Password");
  localStorage.setItem("jwtToken", token);
  setAuthToken(token);
  return userType;
};
