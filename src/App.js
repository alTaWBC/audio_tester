import React, { Component } from "react";
import "./App.css";
import styles from "./App.module.css";

class App extends Component {
    state = {
        soundBytes: [],
        sounds: [],
        index: null,
        stream: null,
        microphone: false,
    };

    componentDidMount() {
        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
            this.setState({ stream });
        });

        this.preparingMicrophone();
    }

    preparingMicrophone = () => {
        if (!this.state.stream) return;
        this.recorder = new MediaRecorder(this.state.stream);
        this.recorder.addEventListener("dataavailable", this.onDataAvailable);
        this.recorder.addEventListener("stop", this.onStop);
        this.setState({ microphone: true });
    };

    onStop = ({ data }) => {
        let soundBytes = [...this.state.soundBytes, data];
        const blob = new Blob(soundBytes);
        const url = URL.createObjectURL(blob);
        const sound = new Audio(url);
        const sounds = [...this.state.sounds, sound];
        soundBytes = [];
        alert(data.size);
        this.setState({ sounds, soundBytes });
    };

    onDataAvailable = ({ data }) => {
        const soundBytes = [...this.state.soundBytes, data];
        alert(data.size);
        this.setState({ soundBytes });
    };

    selectAudio = (index) => this.setState({ index });

    createAudios = (audios) => {
        return audios.map((_, index) => {
            return (
                <div key={index}>
                    <button onClick={() => this.selectAudio(index)}>{index}</button>
                </div>
            );
        });
    };

    playAudio = () => {
        const noAudioWasSelected = this.state.index === null;
        if (noAudioWasSelected) return;

        this.state.sounds[this.state.index].play();
    };

    recordAudio = () => {
        const MicrophoneIsNotInitialized = this.recorder === null;
        if (MicrophoneIsNotInitialized) return;

        const MicrophoneIsRecording = this.recorder.state === "recording";
        if (MicrophoneIsRecording) {
            this.recorder.stop();
        } else {
            this.recorder.start();
        }
    };

    render() {
        try {
            console.log(this.state.stream && !this.state.microphone);
            if (this.state.stream && !this.state.microphone) this.preparingMicrophone();
            const audios = this.createAudios(this.state.sounds);
            return (
                <div>
                    <button onClick={this.recordAudio}>
                        {this.recorder?.state === "recording" ? "Stop" : "Start"}
                    </button>
                    {audios}
                    {this.state.index}
                    <button onClick={this.playAudio} disabled={this.state.index === null}>
                        {this.state.index !== null ? `Play ${this.state.index}` : "Select Sound"}
                    </button>
                </div>
            );
        } catch (e) {
            return <div>{e.message}</div>;
        }
    }
}

export default App;
