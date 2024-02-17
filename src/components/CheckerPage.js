import React, { Component } from 'react';
import axios from 'axios';
import classes from './styles/Checkerpage.module.css';

class CheckerPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadedImage: null,
      visible: false,
      resultImage: null,
      loading: false,
      error: null,
    };
  }

  uploadFile = async (e) => {
    e.preventDefault();

    this.setState({
      visible: false,
      resultImage: null, // Reset resultImage
      loading: true,
      error: null,
    });

    if (!this.state.uploadedImage) {
      console.error("No file selected");
      this.setState({
        loading: false,
        error: "No file selected",
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', this.state.uploadedImage, this.state.uploadedImage.name);

    const API_ENDPOINT = "http://localhost:8000/tbdetection/";

    try {
      const res = await axios.post(API_ENDPOINT, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'arraybuffer',
      });

      const resultImage = new Blob([res.data], { type: 'image/jpeg' });

      this.setState({
        visible: true,
        resultImage: URL.createObjectURL(resultImage),
        loading: false,
      });
    } catch (error) {
      console.error(error);
      this.setState({
        loading: false,
        error: "Error processing image",
      });
    }
  };

  handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      this.setState({
        uploadedImage: file,
      });
    }
  };

  render() {
    return (
      <div>
        <div className={classes.box}>
          <h1 style={{ textAlign: 'center' }} className={classes.title}>
            AI-Assisted Tuberculosis Detection
          </h1>

          <br />
          <form
            style={{
              width: '60%',
            }}
            encType="multipart/form-data" // Ensure proper form submission for file upload
            onSubmit={this.uploadFile}
          >
            <input
              className="form-control"
              type="file"
              name="file-input"
              onChange={this.handleFileInputChange}
            />
            <br />
            <button type="submit" className={classes['btn-primary']}>
              Submit
            </button>
          </form>
        </div>
        <div className={classes.results}>
          {this.state.uploadedImage !== null ? (
            <div className={classes.imageContainer}>
              <img
                className={classes.image}
                src={URL.createObjectURL(this.state.uploadedImage)}
                alt=""
              />
              {this.state.loading ? (
                <p>Loading...</p>
              ) : (
                this.state.visible && (
                  <img
                    className={classes.image}
                    src={this.state.resultImage}
                    alt="Result with bounding boxes"
                  />
                )
              )}
            </div>
          ) : (
            <p>No file selected</p>
          )}
          {this.state.error && (
            <p style={{ color: 'red' }}>{this.state.error}</p>
          )}
        </div>
      </div>
    );
  }
}

export default CheckerPage;
