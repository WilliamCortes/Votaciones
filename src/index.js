import React from "react";
import ReactDOM from "react-dom";

import axios from 'axios'
import "./index.css";
import App from "./App";



axios.defaults.baseURL = process.env.REACT_APP_API || "http://localhost:3001"

ReactDOM.render(<App />, document.getElementById("root"));
