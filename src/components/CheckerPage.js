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
      countdown: 5, // Initial countdown value
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
      this.showError("No file selected");
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
      this.showError("Error processing image");
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

  showError = (errorMessage) => {
    this.setState({ error: errorMessage, loading: false, countdown: 5 }); // Reset countdown and stop loading
    const countdownInterval = setInterval(() => {
      this.setState((prevState) => ({
        countdown: prevState.countdown - 1,
      }));
    }, 1000);

    setTimeout(() => {
      clearInterval(countdownInterval); // Stop countdown
      this.setState({ error: null });
    }, 5000);
  };

  render() {
    return (
      <div className="container">
        {/* Error message with countdown */}
        {this.state.error && (
          <div className="row">
            <div className="col">
              <div className="alert alert-danger" role="alert">
                {this.state.error} ({this.state.countdown})
              </div>
            </div>
          </div>
        )}
        
        {/* Main content */}
        <div className="row">
          <div className="col-md-12">
            <div className={classes.box}>
              <h1 className={`${classes.title} text-center`}>
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
                <button type="submit" className={`btn ${classes['btn-primary']} btn-block`}>
                  Submit
                </button>
              </form>
            </div>
          </div>
          {this.state.loading && (
          <div className="row">
            <div className="col">
              <div className={classes.results}>
                <div className={classes.spinner}></div>
              </div>
            </div>
          </div>
        )}

          {/* Uploaded image */}
          {this.state.uploadedImage && (
            <div className="col-md-6">
              <div className={classes.results}>
                <div className={classes.text}>Uploaded X-Ray</div>
                <div className={classes.imageContainer}>
                  <img
                    className={classes.image}
                    src={URL.createObjectURL(this.state.uploadedImage)}
                    alt=""
                    width="400"
                    height="400"
                    style={{ border: '1px solid black', borderRadius: '12px' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Result display */}
          {this.state.visible && (
            <div className="col-md-6">
            <div className={classes.results}>
              <div className={classes.text}>Output X-ray</div>
              <div className={classes.imageContainer}>
                <img
                  className={classes.image}
                  src={this.state.resultImage}
                  alt=""
                  width="400"
                  height="400"
                  style={{ border: '1px solid black', borderRadius: '12px' }}
                />
              </div>
            </div>
          </div>
          )}
        </div>

        {/* Loading spinner */}
        
      </div>
    );
  }
}

export default CheckerPage;
