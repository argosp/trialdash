import React from 'react';
import config from '../../../config';
import SimpleButton from '../../SimpleButton';
import gql from 'graphql-tag';

const UPLOAD_FILE = gql`
  mutation ($file: Upload!) {
    uploadFile(file: $file) {
      filename
      path
    }
  }
`;

export default function fileUpload({ classes, client, addImage }) {
  async function handleFileChange(e) {
    const data = await client.mutate({
      mutation: UPLOAD_FILE,
      variables: { file: e.target.files[0] },
    });
    if (data && data.data && data.data.uploadFile && data.data.uploadFile.path) {
      addImage(`![${e.target.files[0].name}](${config.url}/${data.data.uploadFile.path})`);
    }
  }

  return (
    <>
      <SimpleButton
        variant="text"
        component="label"
        className={classes.fileUploadBtn}
        labelClassName={classes.labelBtn}
        fullWidth
        text={
          <>
            Attach files
            <input type="file" onChange={handleFileChange} hidden />
          </>
        }
      />
    </>
  );
}
