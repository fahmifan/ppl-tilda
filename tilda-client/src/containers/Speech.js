import React from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';

import { botAPI, axios } from '../utils';
import { AppContext } from '../store';

import wavePng from '../icons/wave.png';
import micKuningPng from '../icons/mic-kuning.png';
import stopBtn from '../icons/stop_btn_2.svg';

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
  margin-top: 50px;
`

const StopBtn = styled.div`
background: url(${stopBtn});
background-size: cover;
width: 100px;
height: 100px;
margin: auto;
margin-top: 50px;
`

const initCountDown = 5*60;

// eslint-disable-next-line no-undef
const recognition = new webkitSpeechRecognition()

class SpeechComp extends React.Component {
  static contextType = AppContext;

  state = {
    speech: '',
    countDown: initCountDown,
    isCountStart: false,
    // eslint-disable-next-line no-undef
    // recognition: new webkitSpeechRecognition(),
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
      // const { recognition } = this.state;
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
            // this.reply();
            this.getReply({ message: final_transcript });
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
        if (!this.state.isCountStart) {
          recognition.stop();
          this.props.history.replace('/');
          // recognition.abort();
          console.log('recog end');
          this.setState({ dialogCount: 0 });
        } else {
          recognition.start();
        }
      }

      recognition.start();
    }
  }

  getReply = async ({ message = '' }) => {
    try {
      const { data } = await botAPI.post('/talk', {
        message: message.toLowerCase(),
      })

      console.log('getReply', data);

      const syntch = speechSynthesis;
      const utterThis = new SpeechSynthesisUtterance(data.reply);
      utterThis.lang = 'en-US';
      console.log(data.reply);
      syntch.speak(utterThis);

    } catch(e) {
      console.log(e);
    }
  }

  handleStart = () => {
    this.setState({ isCountStart: true }, () => {
      this.speechRecog();
    });
  }

  updateProgress = async (duration, userId) => {
    try {
      await axios(`/users/${userId}/progress`, {
        method: 'POST',
        headers: this.context.authHeaders,
        data: {
          duration,
          unixdate: (new Date(Date.now())).getTime(),
        }
      })
    } catch (e) {
      return Promise.reject(e);
    }
  }

  handleStop = () => {
    const duration = initCountDown - this.state.countDown;
    const userId = this.context.user._id;
    this.updateProgress(duration, userId);
    this.setState({ isCountStart: false }, () => {
      console.log('stop recognition')
      // recognition.abort();
      recognition.stop();
      // this.props.history.replace('/your-point');
    });
  }

  render() {
    const { countDown, isCountStart } = this.state;

    if (isCountStart) {
      if (countDown > 0) {
        setTimeout(() => {
          this.setState({ countDown: countDown-1 })
        },1000)
      } else {
        this.handleStop();
      }
    }

    const minute = Math.floor(countDown/60);
    const sec = countDown % 60;

    return (
      <>
      <Card>
        {/* <span style={{ margin: 'auto', fontSize: '3em' }}>00:{countDown < 10 ? `0${countDown}` : countDown}</span> */}
        <span style={{ margin: 'auto', fontSize: '3em' }}>{`0${minute}:${sec < 10 ? `0${sec}` : sec}`}</span>
      </Card> <br />
      {
        !isCountStart 
          ? <StartBtn onClick={() => this.handleStart()} />
          : <StopBtn onClick={() => this.handleStop()} />
      }
      </>
    )
  }
}

export const Speech = withRouter(SpeechComp);