import React from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';

import wavePng from '../icons/wave.png';
import micKuningPng from '../icons/mic-kuning.png';
import micMerahPng from '../icons/mic-merah.png';

const initCountDown = 60;

const color = {
  primary: '#FCB316',
  secondary: '#005188',
  secDark: '#1F3C74',
}

const Card = styled.div`
  height: 110px;
  background-color: blue;
  background: url(${wavePng});
  background-repeat: no-repeat;
  background-size: cover;
  background-position-y: center;
  border-radius: 8px;
  border: 0px;
  padding: 8px;
  margin: 8px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;

  span {
    color: ${color.primary};
    font-size: 1.8em;
    font-weight: bold;
    font-family: 'sans-serif';
  }
`

const StartBtn = styled.div`
  background: url(${micKuningPng});
  background-size: cover;
  width: 100px;
  height: 100px;
  margin: auto;
  margin-top: 100px;
`

const StopBtn = styled.div`
background: url(${micMerahPng});
background-size: cover;
width: 100px;
height: 100px;
margin: auto;
margin-top: 100px;
`

class SpeechComp extends React.Component {
  state = {
    speech: '',
    dialogCount: 0,
    countDown: initCountDown,
    dialog: [
      'morning, how are you',
      'do you have some plans for today',
      'don’t forget eat some breakfast and drink a glass of water, so you don’t get sick',
      'what time are you coming home',
      'i see, be carefull on your way home',
    ],
    isCountStart: false,
    // eslint-disable-next-line no-undef
    recognition: new webkitSpeechRecognition(),
  }

  speechRecog = () => {
    console.log('speech Recog')

    if (!('webkitSpeechRecognition' in window)) {
      // eslint-disable-next-line no-undef
      upgrade();
      console.log('no web kit?');
    } else {
      // eslint-disable-next-line no-undef
      // const recognition = new webkitSpeechRecognition();
      const { recognition } = this.state;
      recognition.lang = 'en-US'
      recognition.continuous = true
      recognition.maxAlternatives = 1
      recognition.interimResults = false

      recognition.onstart = () => {
        console.log('start');
      }

      recognition.onresult = (event) => {
        let interim_transcript = '';
        let final_transcript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          // get last speechrecog confidence
          const speechLen = event.results[i].length;
          const lastSpeechConf = event.results[i][speechLen-1].confidence;

          if (event.results[i].isFinal && lastSpeechConf > 0) {
            console.log('event result', event.results[i]);
            final_transcript += event.results[i][0].transcript;
            console.log('final_transcript', final_transcript);
            this.reply();
          } else {
            interim_transcript += event.results[i][0].transcript;
          }
        }

        this.setState({ speech: interim_transcript });
      }

      recognition.onerror = (event) => {
        console.error(event)
        recognition.stop();
      }

      recognition.onend = () => {
        if (this.state.dialogCount > this.state.dialog.length - 1) {
          recognition.stop();
          console.log('recog end');
          this.setState({ dialogCount: 0 });
        } else {
          recognition.start();
        }
      }

      recognition.start();

      if (this.state.dialogCount > this.state.dialog.length - 1) {
        recognition.stop();
      }
    }
  }

  handleStart = () => {
    this.setState({ isCountStart: true }, () => {
      this.speechRecog();
    });
  }

  handleStop = () => {
    this.state.recognition.stop();
    this.setState({ isCountStart: false });
    this.props.history.replace('/your-point');
  }

  reply = () => {
    const { dialog }= this.state;

    const currCount = this.state.dialogCount;
    const replyWord = dialog[currCount];

    this.setState({ dialogCount: this.state.dialogCount+1 }, () => {
      // say reply
      const syntch = speechSynthesis;
      const utterThis = new SpeechSynthesisUtterance(replyWord);
      utterThis.lang = 'en-US';
      console.log(replyWord);
      syntch.speak(utterThis);
    });
  }

  render() {
    const { countDown, isCountStart, dialogCount, dialog } = this.state;

    if (dialogCount > dialog.length) {
      this.state.recognition.stop();
      this.props.history.replace('/');
    }

    if (isCountStart) {
      if (countDown > 0) {
        setTimeout(() => {
          this.setState({ countDown: countDown-1 })
        },1000)
      } else {
        this.handleStop();
      }
    }

    return (
      <>
      <Card>
        <span style={{ margin: 'auto', fontSize: '3em' }}>00:{countDown < 10 ? `0${countDown}` : countDown}</span>
      </Card> <br />
      {
        !isCountStart 
          ? <StartBtn onClick={() => this.handleStart()} />
          : <StopBtn />
      }
      </>
    )
  }
}

export const Speech = withRouter(SpeechComp);