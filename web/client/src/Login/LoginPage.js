import React from 'react';

import Auth from '../Auth/Auth';
import LoginForm from './LoginForm';

import PropTypes from 'prop-types';

class LoginPage extends React.Component {
  constructor(props, context) {
    // if the class use 'context', need super() invoke parent class constructor
    super(props, context);

    this.state = {
      errors: {},
      user: {
        email: '',
        password: ''
      }
    };

    this.processForm = this.processForm.bind(this);
    this.changeUser = this.changeUser.bind(this);
  }

  processForm(event) {
    event.preventDefault();

    const email = this.state.user.email;
    const password = this.state.user.password;

    console.log('email:' + email);
    console.log('password:' + password);

    // Post login data and handle response.
    fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      cache: false,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.state.user.email,
        password: this.state.user.password
      })
    }).then(response => {
      if (response.status === 200) {
        this.setState({
          errors: {}
        });

        response.json().then(function(json) {
          console.log(json);
          Auth.authenticateUser(json.token, email);
          // redirect router
          this.context.router.replace('/');
        }.bind(this)); // this.context needs bind(this)
      } else {
        console.log('Login failed');
        response.json().then(function(json) {
          const errors = json.errors ? json.errors : {};
          errors.summary = json.message;
          this.setState({errors});
        }.bind(this)); // this.state needs bind(this)
      }
    });
  }
  // if 'this' is used in arrow function, then must bind(this) 

  changeUser(event) {
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;

    this.setState({
      user
    });
  }

  render() {
    return (
      <LoginForm
        onSubmit={this.processForm}
        onChange={this.changeUser}
        errors={this.state.errors}
      />
    );
  }
}

// To make react-router work
LoginPage.contextTypes = {
  router: PropTypes.object.isRequired
};

export default LoginPage;
