import React, { Component } from 'react';
import Dashboard from '../AppLayout';

// TODO Remove this component
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authorized: !!localStorage.getItem('jwt'),
    };
  }

  componentDidMount() {
    const { authorized } = this.state;
    const { history } = this.props;

    if (!authorized) history.push('/login');
  }

  render() {
    const { history } = this.props;

    return <Dashboard history={history} />;
  }
}

export default Home;
