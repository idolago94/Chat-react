import React from 'react';
import './App.css';
import Login from './components/Login';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Main from './components/Main';

function App() {
  return (
    <div className="App">
      {/* <Login /> */}
      <Router>
        <div>
        <Route path="/" exact component={Login} />
        <Route path="/main:user" component={Main} />
        </div>
      </Router>
    </div>
  );
}

export default App;
