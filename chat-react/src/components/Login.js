import React, { Component } from 'react';

class Login extends Component {

  render() {
    return (
      <div>
      <form method='post' action='http://localhost:3000/users/login' > 
          <div>
              <label>Username: </label>
              <input type="text" name="username" />
          </div>
          <div>
              <label>Password: </label>
              <input type="password" name="password" />
          </div>
          <input type="submit" value="LOGIN" />
      </form>
    </div>
    );
  }
}

export default Login;

