import React from 'react';
import io from 'socket.io-client';

const initState = {
  pin: '999',
  showVideo: false,
}

export class LetsTalk extends React.Component {
  _socket = null
  _peer = null
  _isHost = false
  localStream = null

  state = { ...initState }

  localVideo = React.createRef();
  remoteVideo = React.createRef();

  componentWillUnmount() {
    this.stopCall()
  }

  componentDidMount() {
    this.register();
  }

  handleInput = (e) => {
    const name = e.target.name;
    this.setState({
      [name]: e.target.value
    })
  }

  register = async () => {
    try {
      await this.connectWs()
      this._socket.emit('register', this.state.pin)
    } catch(e) {
      window.alert('failed to connect to websocket.')
    }
  }

  start = async () => {
    try {
      navigator.getUserMedia = navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      const localVideo = this.localVideo

      console.log(localVideo)

      localVideo.srcObject = stream
      this.localVideo = localVideo

      this.localStream = stream;
      return stream;
    }
    catch (e) {
      alert(`getUserMedia() error: ${e}`);
      console.error(e)
    }
  }

  onIceCandidate = (event) => {
    if (event.candidate) {
      console.log('* send ice', event.candidate)
      this._socket.emit('ice-new', event.candidate)
    }
  }

  onIceStateChange = () => {
    if (!this._peer) return
  
    const state = this._peer.iceConnectionState
    console.log('^ ice state changed', state)
    switch(state) {
      case 'closed':
      case 'failed':
      case 'disconnected':
        // closeVideoCall()
        break
      default: break;
    }
  }

  gotRemoteStream = (e) => {
    console.log('### got remote stream')
    if (this.remoteVideo.srcObject !== e.streams[0]) {

      console.log(e.streams)

      const remoteVideo = this.remoteVideo
      console.log(remoteVideo)
      this.remoteVideo.srcObject = e.streams[0]
      console.log('### set remote stream')
    }
  }

  receive = (desc) => {
    console.log('# receive')
  
    if (this._isHost) {
      return this._peer.setRemoteDescription(desc)
    }
  
    return this._peer.setRemoteDescription(desc).then(() => {
      return this._peer.createAnswer()
    }).then((answer) => {
      return this._peer.setLocalDescription(answer)
    }).then(() => {
      this._socket.emit('sdp', this._peer.localDescription)
    }).catch((error) => {
      console.log('Receive Offer Error', error.toString())
    })
  }

  createPeer = () => {
    this._peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302"
        }
      ]
    })  
    this._peer.addEventListener('icecandidate', this.onIceCandidate)
    this._peer.addEventListener('iceconnectionstatechange', this.onIceStateChange)
    this._peer.addEventListener('track', this.gotRemoteStream)
  
    this.localStream.getTracks().forEach(track => this._peer.addTrack(track, this.localStream))
  }
  connectWs = () => {
    this._socket = io()

    this._socket.on('reg-result', (res) => {
      console.log('@ reg result', res)
      switch(res.result) {
        case 1:
          this._isHost = true
          this.setState({ showVideo: true }, () => {
            console.log('localvideo', this.localVideo)
            this.start().then(() => {
              this.createPeer()
              this.call()
            })
          })

          break
        case 2:
          this.setState({ showVideo: true }, () => {
            this.start().then(() => {
              this.createPeer()
              if (res.host.desc) {
                this.receive(res.host.desc).then(() => {
                  if (res.host.ice) {
                    this.receiveIce(res.host.ice)
                  }
                })
              }
            })
          })
          break
        default:
          window.alert(res.message || 'Something Wrong with register result')
          break
      }
    })
    
    this._socket.on('sdp', (desc) => {
      this.receive(desc)
    })
    
    this._socket.on('ice-new', (ice) => {
      this.receiveIce(ice)
    })
    
    this._socket.on('partner-disconnected', () => {
      console.log('- partner disconnected')
      this.stopCall()
    })

    return new Promise((resolve, reject) => {
      this._socket.on('connect', function () {
        resolve(1)
      })
      this._socket.on('connect_error', function () {
        reject(1)
      })
      this._socket.on('connect_timeout', function () {
        reject(1)
      })
    })
  }

  call = () => {
    console.log('# call')
  
    return this._peer.createOffer().then((offer) => {
      return this._peer.setLocalDescription(offer);
    }).then(() => {
      this._socket.emit('sdp', this._peer.localDescription)
    }).catch((error) => {
      console.log(`Failed to create session description: ${error.toString()}`);
    })
  }
  stopCall = () => {
    if (this._peer) this._peer.close()
    if (this._socket) this._socket.close()

    this._peer = null
    this._isHost = false
    if (this.localVideo) {
      // const track = this.localVideo.srcObject.getTracks()[0];
      // track.stop()
      // this.localVideo.srcObject = null
    }

    if (this.remoteVideo) {
      // this.remoteVideo.srcObject = null
    }
  }
  receive = (desc) => {
    console.log('# receive')
  
    if (this._isHost) {
      return this._peer.setRemoteDescription(desc)
    }
  
    return this._peer.setRemoteDescription(desc).then(() => {
      return this._peer.createAnswer()
    }).then((answer) => {
      return this._peer.setLocalDescription(answer)
    }).then(() => {
      this._socket.emit('sdp', this._peer.localDescription)
    }).catch((error) => {
      console.log('Receive Offer Error', error.toString())
    })
  }

  receiveIce = (ice) => {
    console.log('# receive ice', ice)
    const candidate = new RTCIceCandidate(ice)
    return this._peer.addIceCandidate(candidate).catch(function (err) {
      console.log('! failed to add ice candidate', err.toString())
    })
  }

  render() {
    const { showVideo } = this.state
    return <>
      {/* <input name='pin' type='text' onChange={this.handleInput} /> */}
      { showVideo && <>
        <video style={{
            backgroundColor: '#444444',
            position: 'fixed',
            right: '20px',
            bottom: '20px',
            width: '30vw',
            height: '30vh',
            zIndex: 2,
        }} playsInline autoPlay ref={vid => this.localVideo = vid}></video>

        <video style={{
            backgroundColor: '#fbfbfb',
            position: 'fixed',
            left: '0px',
            width: '100vw',
            height: '100vh',
            zIndex: 1,
        }} playsInline autoPlay ref={vid => this.remoteVideo = vid}></video>
      </>}
      {/* <button onClick={this.register}>Connect</button> */}
    </>
  } 
}