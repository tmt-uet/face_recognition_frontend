import React from "react";
import Webcam from "react-webcam";
import axios from "axios";
// import ReactInterval from 'react-interval';

class Camera extends React.Component {
  timer = -1;
  timerRecog = -1;
  constructor(props) {
    super(props);
    this.state = {
      // srcImages: [],
      // blobArray: [],
      // blolbImage: "",
      name: "tung"
    };
  }
  setRef = (webcam) => {
    this.webcam = webcam;
  };

  capture = () => {
    if (this.timer === -1)
      this.timer = setInterval(() => {
        const imageSrc = this.webcam.getScreenshot();

        fetch(imageSrc)
          .then((res) => res.blob())
          .then((blob) => {
            this.sendFrameAddUser(blob);
            // this.setState((prevState) => ({
            //   //   blobArray: [...prevState.blobArray, blob],
            //   blolbImage: blob
            // }));
          });

        // console.log(this.state.blolbImage);
      }, 1000);

    // this.setState((prevState) => ({
    //   srcImages: [...prevState.srcImages, imageSrc]
    // }));
  };
  stop = () => {
    clearInterval(this.timer);
    this.timer = -1;
    alert("Đã thêm user");
  };

  handleLogin = async (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    console.log("name", data.get("name"));
    if (data.get("name") !== "") {
      // reference by form input's `name` tag
      await this.setState({
        name: String(data.get("name"))
      });
      this.checkUser();
    } else {
      alert("Chưa điền tên user");
    }
  };

  checkUser = () => {
    axios({
      method: "get",
      url: "http://127.0.0.1:8080/api/check_user",
      params: {
        name: this.state.name
      },

      headers: { "Content-Type": "multipart/form-data" }
    })
      .then(function(response) {
        //handle success
        console.log(response);
      })
      .catch(function(response) {
        //handle error
        console.log(response);
      });
  };

  sendFrameAddUser = (blob) => {
    var bodyFormData = new FormData();
    bodyFormData.append("name", this.state.name);
    bodyFormData.append("img", blob);
    console.log(bodyFormData);
    axios({
      method: "post",
      url: "http://127.0.0.1:8080/api/add_user",
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" }
    })
      .then(function(response) {
        //handle success
        console.log(response);
      })
      .catch(function(response) {
        //handle error
        console.log(response);
      });
  };

  sendFrameRecog = (blob) => {
    var bodyFormData = new FormData();
    bodyFormData.append("name", this.state.name);
    bodyFormData.append("img", blob);
    console.log(bodyFormData);
    axios({
      method: "post",
      url: "http://127.0.0.1:8080/api/recognition",
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" }
    })
      // .then(response => response.json())
      .then((response) => {
        // if(response["data"]["message"]["name"]!==undefined){
        //   console.log(response["data"]["message"]["name"])
        // }
        // else{
        //   console.log(response)
        // }

        console.log(response);
        // console.log(response["data"]["message"]["name"]);

        // response = JSON.stringify(response);
        // console.log(JSON.parse(response));
      })
      .catch(function(response) {
        //handle error
        console.log("error");
        console.log(response);
      });
  };
  train = () => {
    // var bodyFormData = new FormData();
    // bodyFormData.append("name", this.state.name);
    // bodyFormData.append("img", blob);
    // console.log(bodyFormData);
    axios({
      method: "get",
      url: "http://127.0.0.1:8080/api/train",
      params: {
        name: this.state.name
      },

      headers: { "Content-Type": "multipart/form-data" }
    })
      .then(function(response) {
        //handle success
        console.log(response);
      })
      .catch(function(response) {
        //handle error
        console.log(response);
      });
  };

  startRecog = () => {
    if (this.timer === -1)
      this.timer = setInterval(() => {
        const imageSrc = this.webcam.getScreenshot();

        fetch(imageSrc)
          .then((res) => res.blob())
          .then((blob) => {
            this.sendFrameRecog(blob);
            // this.setState((prevState) => ({
            //   //   blobArray: [...prevState.blobArray, blob],
            //   blolbImage: blob
            // }));
          });

        console.log(this.state.blolbImage);
      }, 2000);
  };
  stopRecog = () => {
    clearInterval(this.timer);
    this.timer = -1;
    alert("Tạm dừng nhận diện !");
  };

  render() {
    const videoConstraints = {
      width: 640,
      height: 480,
      facingMode: "user"
    };

    return (
      <div>
        <Webcam
          className="webcamInput"
          audio={false}
          height={480}
          ref={this.setRef}
          screenshotFormat="image/jpeg"
          width={640}
          videoConstraints={videoConstraints}
        />

        <form onSubmit={this.handleLogin}>
          <label>Name</label>
          <input type="text" name="name" id="name" placeholder="tung" />

          <button type="submit">Submit</button>
        </form>

        <button onClick={this.capture}>Start</button>
        <button onClick={this.stop}>Stop</button>
        <button onClick={this.train}>Train</button>

        <div>
          <button onClick={this.startRecog}>Start Recog</button>
          <button onClick={this.stopRecog}>Stop Recog</button>
        </div>
      </div>
    );
  }
}
export default Camera;
