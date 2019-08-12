
import gql from 'graphql-tag';

export default (trial) => {
    return gql`mutation {
        buildExperimentData(
            id: "${trial.id}", 
            uid: "${localStorage.getItem('uid')}",
        )
    }`;
};
