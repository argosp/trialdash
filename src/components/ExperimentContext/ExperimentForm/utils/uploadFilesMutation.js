import gql from 'graphql-tag';
import { UPLOAD_FILE } from '../../../../constants/base';

export default (file) => {
  return gql`mutation {
        ${UPLOAD_FILE}(file: ${file})
           {
            filename
            mimetype
            encoding
            path
           }
      }`;
};
