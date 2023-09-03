import React from 'react';
import { withTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
// import Graph from '../../../apolloGraphql';
// import dataMutation from './utils/dataMutation';
import classes from './styles';

// const graphql = new Graph();

class DataForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // id: this.props.id || '',
      name: this.props.name || '',
      properties: this.props.properties || [],
    };
  }

  componentDidMount() {
  }


    handleChange = key => (event) => {
      this.setState({
        [key]: event.target.value,
      });
    };


    submitData = () => {
      /*      const newData = {
        id: this.state.id,
        experimentId: this.props.experimentId,
        name: this.state.name,
      }; */

      /*      graphql.sendMutation(dataMutation(newData)) // TODO change to client.mutate()
        .then((data) => {
          window.alert(`saved ${this.props.entityType} ${data.addUpdateData.id}`);
          this.props.showAll();
        })
        .catch((err) => {
          window.alert(`error: ${err}`);
        }); */
    };

    handleChangeProprty = (index, key) => (event) => {
      this.state.properties[index][key] = event.target.value;
      this.setState({ });
    };

    render() {
      return (
        <form
          className={classes.container}
          noValidate
          autoComplete="off"
          style={{
            textAlign: 'left',
            padding: '70px',
            marginLeft: '240px',
            zIndex: 999,
            background: '#FFFFFF',
            height: '100%',
            width: 'calc(100% - 240px)' }}
        >
          <div>
            {/* <TextField style={{ width: '300px' }}
                        error={this.state.errors.id}
                        id="id"
                        label="ID"
                        className={classes.textField}
                        value={this.state.id}
                        onChange={this.handleChange('id')}
                    />
                    <br /> */}
            <TextField
              style={{ width: '300px', marginTop: '30px' }}
              id="name"
              label="Name"
              className={classes.textField}
              value={this.state.name}
              onChange={this.handleChange('name')}
            />
            <br />
            <TextField
              style={{ width: '300px', marginTop: '30px' }}
              id="begin"
              label="Begin"
              type="date"
              className={classes.textField}
              value={this.state.begin}
              onChange={this.handleChange('begin')}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <br />
            <TextField
              style={{ width: '300px', marginTop: '30px' }}
              id="end"
              label="End"
              type="date"
              className={classes.textField}
              value={this.state.end}
              onChange={this.handleChange('end')}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
          <FormControl className={classes.formControl} style={{ width: '300px', marginTop: '30px' }}>
            <div style={{ marginTop: '50px', textAlign: 'center', display: 'flex' }}>
              <Button
                variant="contained"
                className={classes.button}
                style={{ width: '180px' }}
                onClick={this.submitData}
              >
                                Submit
              </Button>
              {this.props.close && (
              <Button
                variant="contained"
                className={classes.button}
                style={{ width: '180px' }}
                onClick={this.props.close}
              >
                                Cancel
              </Button>
              )}
            </div>
          </FormControl>
        </form>
      );
    }
}

export default withTheme(DataForm);
