import React, { Component } from 'react';
import { withRouter} from 'react-router-dom';
// import TrialForm from './../TrialForm';
import ListOfExperiments from '../ExperimentContext/Dashboard';
//COMPONENTS

class Home extends Component {
    constructor(props){
        super(props);
        this.state = {
            authorized: !!localStorage.getItem('jwt')
        }
    }
    componentDidMount(){
    !this.state.authorized && this.props.history.push('/login')
    }
    logout = () => {
        localStorage.clear();
        this.props.history.push('/login');
    }
  render() {
    return (
        <div>
            <div style={{display:'flex', justifyContent: 'flex-end', padding:30}}>
                
            </div>
            <ListOfExperiments history={this.props.history}/>
        </div>
    );
  }
}

export default Home;
