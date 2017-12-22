import * as React from 'react';
import LoginPage from './LoginPage';

import '../styles/App.css';

const logo = require('../icons/logo.svg');

class App extends React.Component {
  render() {
    return (
      <div className="app">
        <div className="app__header">
          <img
              className="app__header__logo"
              src={logo}
              alt="Test"
          />
          <h2 className="app__header__text">
            Sample Sign-up Form
          </h2>
        </div>
        <div className="app__content">
          <LoginPage />
        </div>
      </div>
    );
  }
}

export default App;
