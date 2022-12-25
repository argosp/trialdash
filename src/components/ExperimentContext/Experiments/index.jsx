import React from "react";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import uuid from "uuid/v4";
import { withStyles } from "@material-ui/core";
import moment from "moment";
import Dotdotdot from "react-dotdotdot";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Link } from "react-router-dom";
import { compose } from "recompose";
import { withApollo } from "react-apollo";
import ContentTable from "../../ContentTable";
import StyledTableCell from "../../StyledTableCell";
import config from "../../../config";
import { styles } from "./styles";
import {
  EXPERIMENTS_WITH_DATA,
  TRIAL_SETS_DASH,
  EXPERIMENT_MUTATION,
  UPLOAD_EXPERIMENT,
} from "../../../constants/base";
import ContentHeader from "../../ContentHeader";
import experimentsQuery from "../utils/experimentsQuery";
import experimentAllDataQuery from "../utils/experimentAllDataQuery";
import uploadExperiment from "../utils/uploadExperimentMutation";
import {
  CloneIcon,
  PenIcon,
  BasketIcon,
  DownloadIcon,
} from "../../../constants/icons";
import CustomTooltip from "../../CustomTooltip";
import ExperimentForm from "../ExperimentForm";
import experimentMutation from "../ExperimentForm/utils/experimentMutation";
import { updateCache } from "../../../apolloGraphql";
import ConfirmDialog from "../../ConfirmDialog";
import gql from "graphql-tag";

const UPLOAD_FILE = gql`
  mutation ($file: Upload!) {
    uploadFile(file: $file) {
      filename
      path
    }
  }
`;

class Experiments extends React.Component {
  state = {
    confirmOpen: false,
  };

  setConfirmOpen = (open, experiment) => {
    if (experiment || open) {
      this.setState({ experiment });
    }
    this.setState({ confirmOpen: open });
  };

  renderTableRow = (experiment) => {
    const { classes, client, history } = this.props;
    const { confirmOpen } = this.state;

    return (
      <React.Fragment key={experiment.project.id}>
        <StyledTableCell
          align="left"
          className={classes.tableCell}
          onClick={() =>
            history.push(
              `/experiments/${experiment.project.id}/${TRIAL_SETS_DASH}`
            )
          }
        >
          <p className={classes.cellTextLine}>{experiment.name}</p>
          <div className={classes.cellTextLine}>
            <Dotdotdot clamp={1}>{experiment.description}</Dotdotdot>
          </div>
        </StyledTableCell>
        <StyledTableCell
          align="left"
          className={classes.tableCell}
          onClick={() =>
            history.push(
              `/experiments/${experiment.project.id}/${TRIAL_SETS_DASH}`
            )
          }
        >
          {moment(experiment.begin).format("D/M/YYYY")}
        </StyledTableCell>
        <StyledTableCell
          align="left"
          className={classes.tableCell}
          onClick={() =>
            history.push(
              `/experiments/${experiment.project.id}/${TRIAL_SETS_DASH}`
            )
          }
        >
          {moment(experiment.end).format("D/M/YYYY")}
        </StyledTableCell>
        <StyledTableCell
          align="left"
          className={classes.tableCell}
          onClick={() =>
            history.push(
              `/experiments/${experiment.project.id}/${TRIAL_SETS_DASH}`
            )
          }
        >
          {experiment.numberOfTrials}
        </StyledTableCell>
        <StyledTableCell align="right">
          <CustomTooltip
            title="Download"
            ariaLabel="download"
            onClick={() => this.download(experiment)}
          >
            <DownloadIcon />
          </CustomTooltip>
          <CustomTooltip
            title="Clone"
            ariaLabel="clone"
            onClick={() => this.clone(experiment)}
          >
            <CloneIcon />
          </CustomTooltip>
          <CustomTooltip
            title="Edit"
            ariaLabel="edit"
            onClick={() => this.activateEditMode(experiment)}
          >
            <PenIcon />
          </CustomTooltip>
          <CustomTooltip
            title="Delete"
            ariaLabel="delete"
            onClick={() => this.setConfirmOpen(true, experiment)}
          >
            <BasketIcon />
          </CustomTooltip>
          <ConfirmDialog
            title="Delete Experiment"
            open={confirmOpen}
            setOpen={this.setConfirmOpen}
            onConfirm={this.deleteExperiment}
            inputValidation
          >
            Are you sure you want to delete this experiment?
          </ConfirmDialog>
          <CustomTooltip
            title="Open"
            className={classes.arrowButtonTooltip}
            ariaLabel="open"
          >
            <Link
              to={() => {
                client.writeData({ data: { headerTabId: 0 } }); // 0 is the Trials tab
                return `/experiments/${experiment.project.id}/${TRIAL_SETS_DASH}`;
              }}
              className={classes.arrowButtonLink}
            >
              <ArrowForwardIosIcon />
            </Link>
          </CustomTooltip>
        </StyledTableCell>
      </React.Fragment>
    );
  };

  deleteExperiment = async () => {
    const newEntity = this.state.experiment;
    newEntity.state = "Deleted";
    newEntity.projectId = newEntity.project.id;
    const { client } = this.props;

    const mutation = experimentMutation;

    await client.mutate({
      mutation: mutation(newEntity),
      update: (cache, mutationResult) => {
        updateCache(
          cache,
          mutationResult,
          experimentsQuery,
          EXPERIMENTS_WITH_DATA,
          EXPERIMENT_MUTATION,
          true
        );
      },
    });
    this.setState({ update: true, experiment: null });
  };

  activateEditMode = (experiment) => {
    this.setState({
      isEditModeEnabled: true,
      experiment,
    });
  };

  returnFunc = (update) => {
    this.setState({
      isEditModeEnabled: false,
      update,
    });
  };

  fetchImageBlob = async (imageUrl) => {
    return new Promise((resolve) => {
      fetch(imageUrl)
        .then((response) => response.blob())
        .then((image) => resolve(image));
    });
  };

  getImageFromMap = async (map) => {
    return new Promise(async (resolve) => {
      // const fileExtension = map.imageName.split('.')
      // const fileName = `${map.imageName}.${fileExtension[fileExtension.length - 1]}`
      const image = await this.fetchImageBlob(`${config.url}/${map.imageUrl}`);
      return resolve({
        ...map,
        imageUrl: image,
      });
    });
  };

  getImageFromLog = async (comment) => {
    return new Promise(async (resolve) => {
      const regex = /!\[(.*?)\]\((.*?)\)/g;
      const imagesData = [];
      let m;
      while ((m = regex.exec(comment)) !== null) {
        if (m.index === regex.lastIndex) {
          regex.lastIndex++;
        }
        imagesData.push({ imageUrl: m[2], imageName: m[1] });
      }
      const images = await Promise.all(
        imagesData.map(async (img) => {
          const blob = await this.fetchImageBlob(img.imageUrl);
          return {
            imageUrl: blob,
            imageName: img.imageName,
          };
        })
      );
      return resolve(images);
    });
  };

  download = async (experiment) => {
    const expToDownload = { ...experiment };
    this.props.client
      .query({
        query: experimentAllDataQuery(experiment.project.id),
      })
      .then(async (data) => {
        if (data && data.data.getAllExperimentData) {
          expToDownload.maps = await Promise.all(
            expToDownload.maps.map(
              async (map) => await this.getImageFromMap(map)
            )
          );
          const logImages = await Promise.all(
            data.data.getAllExperimentData.logs.map(
              async (log) => await this.getImageFromLog(log.comment)
            )
          );
          const zip = JSZip();
          zip.file(
            "data.json",
            JSON.stringify({
              version: "2.0.0.",
              ...data.data.getAllExperimentData,
              experiment: expToDownload,
            })
          );
          expToDownload.maps.forEach((img) => {
            zip.file(`images/${img.imageName}`, img.imageUrl, {
              binary: true,
            });
          });
          logImages.forEach((array) => {
            array.forEach((img) => {
              zip.file(`images/${img.imageName}`, img.imageUrl, {
                binary: true,
              });
            });
          });

          zip.generateAsync({ type: "blob" }).then(function (blob) {
            saveAs(blob, `experiment_${experiment.name}.zip`);
          });
        }
      });
  };

  uploadImagesFromZip = async (zip) => {
    return new Promise(async (resolve) => {
      const files = zip.file(/^images/);
      const images = await Promise.all(
        files.map(async (file) => {
          const fileName = file.name.replace("images/", "");
          const img = await file.async("blob");
          const res = await this.props.client.mutate({
            mutation: UPLOAD_FILE,
            variables: { file: img },
          });
          return { [fileName]: res.data.uploadFile.path };
        })
      );
      return resolve(Object.assign({}, ...images));
    });
  };

  replaceImagesInLog = (comment, images) => {
    const regex = /!\[(.*?)\]\((.*?)\)/g;
    function replacer(match, p1) {
      return `![${p1}](${config.url}/${images[p1]})`;
    }
    return comment.replace(regex, replacer);
  };

  upload = (e) => {
    const zip = new JSZip();
    zip.loadAsync(e.target.files[0]).then(async (content) => {
      let jsonData = await zip.file("data.json").async("string");
      jsonData = JSON.parse(jsonData);
      const images = await this.uploadImagesFromZip(zip);
      jsonData.experiment.maps = jsonData.experiment.maps.map((img) => ({
        ...img,
        imageUrl: images[img.imageName],
      }));

      jsonData.logs = jsonData.logs.map((log) => ({
        ...log,
        comment: this.replaceImagesInLog(log.comment, images),
      }));

      await this.props.client.mutate({
        mutation: uploadExperiment(jsonData),
        update: (cache, mutationResult) => {
          updateCache(
            cache,
            mutationResult,
            experimentsQuery,
            EXPERIMENTS_WITH_DATA,
            UPLOAD_EXPERIMENT
          );
        },
      });
      this.setState({ update: true });
    });
  };

  clone = async (experiment) => {
    const clonedEXperiment = { ...experiment };
    clonedEXperiment.key = uuid();
    clonedEXperiment.projectId = "";
    const { client } = this.props;
    clonedEXperiment.numberOfTrials = 0;
    clonedEXperiment.cloneTrailId = experiment.project.id;

    await client.mutate({
      mutation: experimentMutation(clonedEXperiment),
      update: (cache, mutationResult) => {
        updateCache(
          cache,
          mutationResult,
          experimentsQuery,
          EXPERIMENTS_WITH_DATA,
          EXPERIMENT_MUTATION
        );
      },
    });
    this.setState({ update: true });
  };

  setUpdated = () => {
    this.setState({ update: false });
  };
  updateExperiment = (experiment) => {
    this.setState({ experiment });
  };

  render() {
    const tableHeadColumns = [
      {
        key: 0,
        title: "",
      },
      {
        key: 1,
        title: "Start date",
      },
      {
        key: 2,
        title: "End date",
      },
      {
        key: 3,
        title: "Trials",
      },
    ];

    return (
      <>
        {this.state.isEditModeEnabled ? (
          // eslint-disable-next-line react/jsx-wrap-multilines
          <ExperimentForm
            {...this.props}
            updateExperiment={this.updateExperiment}
            experiment={this.state.experiment}
            returnFunc={this.returnFunc}
          />
        ) : (
          // eslint-disable-next-line react/jsx-wrap-multilines
          <>
            <ContentHeader
              withSearchInput
              title="Experiments"
              searchPlaceholder="Search experiments"
              withAddButton
              addButtonText="Add experiment"
              addButtonHandler={() =>
                this.props.history.push("/add-experiment")
              }
              withUploadButton
              uploadButtonText="Upload experiment"
              uploadButtonHandler={this.upload}
            />
            <ContentTable
              contentType={EXPERIMENTS_WITH_DATA}
              query={experimentsQuery}
              tableHeadColumns={tableHeadColumns}
              renderRow={this.renderTableRow}
              update={this.state.update}
              setUpdated={this.setUpdated}
            />
          </>
        )}
      </>
    );
  }
}

export default compose(
  withApollo,
  withStyles(styles, { withTheme: true })
)(Experiments);
