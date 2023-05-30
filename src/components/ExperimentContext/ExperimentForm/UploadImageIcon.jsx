import React, { useRef, useContext } from "react";
import gql from 'graphql-tag';
import { WorkingContext } from "../../AppLayout";
import {
    IconButton,
    Icon,
} from "@material-ui/core";

const UPLOAD_FILE = gql`
  mutation($file: Upload!) {
    uploadFile(file: $file){
      filename
      path
    }
  }`;

export const UploadImageIcon = ({ onChangeFile, client }) => {
    const inputFile = useRef(null);
    const { working, setWorking } = useContext(WorkingContext);

    const onButtonClick = () => {
        // `current` points to the mounted file input element
        inputFile.current.click();
    };

    const getImageSize = async (imageFile) => {
        return new Promise(resolve => {
            const img = new Image();
            img.onload = () => {
                resolve([img.naturalHeight, img.naturalWidth])
            };
            img.src = window.URL.createObjectURL(imageFile);
        })
    }

    const handleChangeFile = async (event) => {
        event.stopPropagation();
        event.preventDefault();

        const file = event.target.files[0];
        if (!file) {
            return;
        }

        setWorking(true);

        const [height, width] = await getImageSize(file);
        if (height && width) {
            const imageServerfFilename = await uploadFileToServer(file);
            if (imageServerfFilename) {
                onChangeFile(imageServerfFilename.path, height, width)
            }
        }
        setWorking(false);
    };

    const uploadFileToServer = async (file) => {
        const data = await client.mutate({ mutation: UPLOAD_FILE, variables: { file } });
        if (!data || !data.data || !data.data.uploadFile || data.data.uploadFile === "err") {
            return undefined;
        }
        return data.data.uploadFile
    };

    return (
        <>
            <input
                type="file"
                id="file"
                ref={inputFile}
                style={{ display: "none" }}
                onChange={handleChangeFile}
                accept="image/*"
            />
            <IconButton aria-label="expand row" onClick={onButtonClick} disabled={working}>
                <Icon>folder_open</Icon>
            </IconButton>
        </>
    );
};