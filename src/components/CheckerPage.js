import React, { Component } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import classes from './styles/Checkerpage.module.css';

class CheckerPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadedImage: null,
      visible: false,
      resultImage: null,
      classificationResult: null,
      loading: false,
      error: null,
      inputImageSize: { width: 400, height: 400 }, // Initial size of input image
      outputImageSize: { width: 400, height: 400 }, // Initial size of output image
    };
  }

  toggleImageSize = (type) => {
    this.setState((prevState) => ({
      [`${type}ImageSize`]: prevState[`${type}ImageSize`].width === 400
        ? { width: 650, height: 650 }
        : { width: 400, height: 400 },
    }));
  };

  uploadFile = async (e) => {
    e.preventDefault();

    this.setState({
      visible: false,
      resultImage: null, // Reset resultImage
      classificationResult: null, // Reset classificationResult
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
    const CLASSIFICATION_ENDPOINT = "http://localhost:8000/tbdetection/class";

    try {
      // Send both requests simultaneously
      const [res, classificationRes] = await Promise.all([
        axios.post(API_ENDPOINT, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          responseType: 'arraybuffer',
        }),
        axios.post(CLASSIFICATION_ENDPOINT, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        })
      ]);

      const resultImage = new Blob([res.data], { type: 'image/jpeg' });
      const classificationResult = classificationRes.data;

      this.setState({
        visible: true,
        resultImage: URL.createObjectURL(resultImage),
        classificationResult: classificationResult,
        loading: false,
      });

      // Show toast
      if (classificationResult === "negative") {
        toast.error("Classification Result: Positive", {
          position: "top-right",
          autoClose: 5000,
          style: { marginTop: '30px', backgroundColor: 'red', color: 'white' }
        });
      } else {
        toast.success("Classification Result: Negative", {
          position: "top-right",
          autoClose: 5000,
          style: { marginTop: '30px', backgroundColor: 'green', color: 'white' }
        });
      }
      

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
    this.setState({ error: errorMessage, loading: false }); // Stop loading
    setTimeout(() => {
      this.setState({ error: null });
    }, 5000);
  };

  render() {
    return (
      <div className="container">
        {/* Error message */}
        {this.state.error && (
          <div className="row">
            <div className="col">
              <div className="alert alert-danger" role="alert">
                {this.state.error}
              </div>
            </div>
          </div>
        )}

        {/* Toast Container */}
        <ToastContainer />

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
                    width={this.state.inputImageSize.width}
                    height={this.state.inputImageSize.height}
                    style={{ border: '1px solid black', borderRadius: '12px', width: this.state.inputImageSize.width + 'px', height: this.state.inputImageSize.height + 'px' }}
                    onDoubleClick={() => this.toggleImageSize('input')}
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
                    width={this.state.outputImageSize.width}
                    height={this.state.outputImageSize.height}
                    style={{ border: '1px solid black', borderRadius: '12px', width: this.state.outputImageSize.width + 'px', height: this.state.outputImageSize.height + 'px' }}
                    onDoubleClick={() => this.toggleImageSize('output')}
                  />
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    );
  }
}

export default CheckerPage;
