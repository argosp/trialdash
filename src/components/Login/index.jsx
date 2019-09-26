import React from 'react';
import { Redirect } from 'react-router-dom';

// MATERIAL-UI
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

// APOLLO GRAPHQL
import gql from 'graphql-tag';
import Graph from '../../apolloGraphql';
import { styles } from './styles';
import setAuthToken from './setAuthToken';

const graph = new Graph();
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }

  onInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  login = (e) => {
    e.preventDefault();
    const mutation = gql`
                  mutation {
                    login(email: "${this.state.email}",
                    password: "${this.state.password}") {
                      uid
                      token
                    }
                  }
            `;
    graph.sendMutation(mutation).then((data) => {
      if (data.login && data.login.error) {
        console.log('Login error', data.login.error);
      } else {
        localStorage.setItem('jwt', data.login.token);
        localStorage.setItem('uid', data.login.uid);
        setAuthToken(data.login.token);
        this.props.history.push('/');
      }
    });
  };

  render() {
    const { classes } = this.props;
    if (localStorage.getItem('jwt')) {
      return <Redirect to="/" />;
    }

    return (
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
    );
  }
}

export default withStyles(styles)(Login);
