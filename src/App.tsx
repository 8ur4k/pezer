import { useEffect, useRef } from "react";
import "./App.css";
import Peer, { MediaConnection } from "peerjs";
import { useGlobalState } from "./store/globalState";
import {
  initialHostState,
  // initialNotHostState,
  // initialCallState,
} from "./store/initialState";
import { create } from "zustand";

const hostUse = create<ReturnType<typeof initialHostState>>(initialHostState);

// const useNotHost =
//   create<ReturnType<typeof initialNotHostState>>(initialNotHostState);
// const useCall = create<ReturnType<typeof initialCallState>>(initialCallState);

function App() {
  console.log("app");
  let auido1 = useRef<HTMLAudioElement>(null);
  let ringtone = useRef<HTMLAudioElement>(null);
  let amogus = useRef<HTMLAudioElement>(null);
  let currentCall = useRef<MediaConnection | null>(null);

  const callStatus = useGlobalState((state) => state.callStatus);
  const callAddress = window.location.pathname.slice(1);
  const clientAddress = hostUse((state: any) => state.hostID);

  const hostCam = hostUse((state: any) => state.hostCam);
  const hostMic = hostUse((state: any) => state.hostMic);
  const hostScreenShare = hostUse((state: any) => state.hostScreenShare);
  const toggleCam = hostUse((state: any) => state.toggleHostCam);
  const toggleMic = hostUse((state: any) => state.toggleHostMic);
  const toggleScreenShare = hostUse(
    (state: any) => state.toggleHostScreenShare
  );

  function handleOptions(opt: string) {
    if (opt == "camera") toggleCam();
    if (opt == "microphone") toggleMic();
    if (opt == "screenshare") toggleScreenShare();

    console.log(hostUse.getState());
  }

  function copyToClipboard() {
    if (navigator && navigator.clipboard && navigator.clipboard.writeText)
      return navigator.clipboard.writeText(
        `${window.location.origin}/${clientAddress}`
      );
    return Promise.reject("The Clipboard API is not available.");
  }

  function pezerle() {
    useGlobalState.setState({ callStatus: "ON_CALL" });
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        currentCall?.current?.answer(stream); // Answer the call with an A/V stream.
        currentCall?.current?.on("stream", (remoteStream) => {
          if (auido1.current) auido1.current.srcObject = remoteStream;
        });
      })
      .catch((err) => {
        console.error("Failed to get local stream", err);
      });
  }

  function endCall() {
    if (useGlobalState.getState().callStatus !== "IDLE") {
      window.location.replace(window.location.origin);
      useGlobalState.setState({ callStatus: "IDLE" });
    }
  }

  useEffect(() => {
    console.log("useEffect");
    const peer = new Peer(clientAddress);

    peer.on("call", (call) => {
      if (useGlobalState.getState().callStatus == "IDLE") {
        useGlobalState.setState({ callStatus: "INCOMING_CALL" });
        currentCall.current = call;
      }
    });

    setTimeout(() => {
      if (callStatus !== "ON_CALL" && callAddress) {
        navigator.mediaDevices.getUserMedia({ audio: true }).then(
          (stream) => {
            const call = peer.call(callAddress, stream);
            console.log("call");
            call.on("stream", (remoteStream) => {
              if (auido1.current) auido1.current.srcObject = remoteStream;
              useGlobalState.setState({ callStatus: "ON_CALL" });
            });
          },
          (err) => {
            console.error("Failed to get local stream", err);
          }
        );
      }
    }, 1000);
  }, [callStatus, callAddress, clientAddress]);

  return (
    <div className="body">
      <div className="container">
        <h1>PE2ER</h1>
        <p>Ne biçim konuşuyon pezer mezer.</p>
        <div className="clientLogin">
          <div className="clienInput">
            <input
              value={
                callStatus == "ON_CALL"
                  ? `Ongoing call...`
                  : `${window.location.origin}/${clientAddress}`
              }
              type="text"
              disabled
              placeholder="Connection link"
            />
          </div>
          {callStatus !== "ON_CALL" && (
            <input
              onClick={() => copyToClipboard()}
              className="copyButton"
              type="button"
              value="Copy"
            />
          )}
          {callStatus == "ON_CALL" && (
            <input
              onClick={() => endCall()}
              className="copyButton"
              type="button"
              value="End"
            />
          )}
        </div>
        {callStatus == "INCOMING_CALL" && (
          <div className="callMedia">
            <input
              className="pezerleButton"
              type="button"
              onClick={() => pezerle()}
              value="P E Z E R L E!"
            />
            <p onClick={() => endCall()} className="declineText">
              Press to decline.
            </p>
            <audio
              ref={ringtone!}
              autoPlay
              id="audio-ringtone"
              src="/assets/ringtone.mp3"
            ></audio>
          </div>
        )}
        <audio
          className="dNone"
          ref={auido1!}
          controls
          autoPlay
          id="audio-1"
        ></audio>
        {callStatus == "ON_CALL" && (
          <div>
            <audio ref={amogus!} autoPlay src="/assets/amogus.mp3"></audio>
          </div>
        )}
      </div>
      <div className="toolKit">
        <div className="toolKitButtons" onClick={() => handleOptions("camera")}>
          <img
            className={hostCam ? "enabledSvg" : "disabledSvg"}
            src="../assets/video.svg"
            alt=""
          />
        </div>
        <div
          className="toolKitButtons"
          onClick={() => handleOptions("microphone")}
        >
          <img
            className={hostMic ? "enabledSvg" : "disabledSvg"}
            src="../assets/microphone.svg"
            alt=""
          />
        </div>
        <div
          className="toolKitButtons"
          onClick={() => handleOptions("screenshare")}
        >
          <img
            className={hostScreenShare ? "enabledSvg" : "disabledSvg"}
            src="../assets/share-screen.svg"
            alt=""
          />
        </div>
        <div className="toolKitButtons" onClick={() => endCall()}>
          <img src="../assets/end.png" alt="" />
        </div>
      </div>
      <script src="https://unpkg.com/peerjs@1.4.6/dist/peerjs.min.js"></script>
      <script src="index.js"></script>
    </div>
  );
}

export default App;

/* eslint eqeqeq: 0*/
