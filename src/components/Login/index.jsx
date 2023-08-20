import React from 'react';
import { Redirect } from 'react-router-dom';
import {
  Avatar,
  Button,
  CssBaseline,
  FormControl,
  FormControlLabel,
  Checkbox,
  Input,
  InputLabel,
  Paper,
  Typography,
} from '@material-ui/core';
import LockIcon from '@material-ui/icons/LockOutlined';
import withStyles from '@material-ui/core/styles/withStyles';
import gql from 'graphql-tag';
import { compose } from 'recompose';
import { withApollo } from 'react-apollo';
import { styles } from './styles';
import setAuthToken from './setAuthToken';

class Login extends React.Component {
  state = {
    email: '',
    password: '',
    error: ''
  };

  onInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      error: ''
    });
  };

  login = async (e) => {
    e.preventDefault();

    const { client, history } = this.props;
    const mutation = gql`
                  mutation {
                    login(email: "${this.state.email}",
                    password: "${this.state.password}") {
                      uid
                      token
                    }
                  }
            `;
    try {
      const { data } = await client.mutate({ mutation });

      if (data.login && data.login.error) {
        console.log('Login error', data.login.error);
        this.setState({ error: data.login.error + '' });
      } else {
        localStorage.setItem('jwt', data.login.token);
        localStorage.setItem('uid', data.login.uid);
        setAuthToken(data.login.token);
        history.push('/experiments');
      }
    } catch (e) {
      this.setState({ error: e + '' })
    }
  };

  render() {
    const { classes } = this.props;

    if (localStorage.getItem('jwt')) {
      return <Redirect to="/" />;
    }

    return (
      <>
        <main className={classes.main}>
          <CssBaseline />
          <Paper className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <form className={classes.form} onSubmit={this.login}>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="email">Email Address</InputLabel>
                <Input
                  id="email"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  onChange={this.onInputChange}
                  value={this.state.email}
                />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="password">Password</InputLabel>
                <Input
                  name="password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={this.onInputChange}
                  value={this.state.password}
                />
              </FormControl>
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Sign in
              </Button>
            </form>
          </Paper>
        </main>
        {this.state.error === '' ? null :
          <Typography variant="h6" color="error" align='center' style={{ marginTop: 20 }}>
            {this.state.error}
          </Typography>
        }
      </>
    );
  }
}

export default compose(
  withApollo,
  withStyles(styles),
)(Login);
