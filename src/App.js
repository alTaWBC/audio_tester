import React, { Component } from "react";
import "./App.css";
import styles from "./App.module.css";

class App extends Component {
    state = {
        soundBytes: [],
        sounds: [],
        index: null,
    };

    componentDidMount() {
        this.preparingMicrophone();
    }

    preparingMicrophone = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.recorder = new MediaRecorder(stream);
        this.recorder.addEventListener("dataavailable", this.onDataAvailable);
        this.recorder.addEventListener("stop", this.onStop);
    };

    onStop = ({ data }) => {
        let soundBytes = [...this.state.soundBytes, data];
        const blob = new Blob(soundBytes, { type: "audio/mp4" });
        const url = URL.createObjectURL(blob);
        const sound = new Audio(url);
        const sounds = [...this.state.sounds, sound];
        soundBytes = [];
        this.setState({ sounds, soundBytes });
    };

    onDataAvailable = ({ data }) => {
        const soundBytes = [...this.state.soundBytes, data];
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
