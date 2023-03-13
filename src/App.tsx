import { useEffect, useRef } from "react";
import "./App.css";
import Peer, { MediaConnection } from "peerjs";
import { useGlobalState } from "./store/globalState";
import { initialHostState, initialNotHostState } from "./store/initialState";
import { create } from "zustand";

const useHost = create<ReturnType<typeof initialHostState>>(initialHostState);
const useNotHost =
  create<ReturnType<typeof initialNotHostState>>(initialNotHostState);

function App() {
  let audio1 = useRef<HTMLAudioElement>(null);
  let ringtone = useRef<HTMLAudioElement>(null);
  let amogus = useRef<HTMLAudioElement>(null);
  let currentCall = useRef<MediaConnection | null>(null);

  const callStatus = useGlobalState((state) => state.callStatus);

  const callAddress = useNotHost((state: any) => state.notHostID);
  const clientAddress = useHost((state: any) => state.hostID);

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

        currentCall?.current?.on("iceStateChanged", function (state) {
          if (state === "disconnected") endCall();
        });
        currentCall?.current?.on("stream", (remoteStream) => {
          if (audio1.current) audio1.current.srcObject = remoteStream;
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
            call.on("iceStateChanged", function (state) {
              if (state === "disconnected") endCall();
            });
            call.on("stream", (remoteStream) => {
              if (audio1.current) audio1.current.srcObject = remoteStream;
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
          ref={audio1!}
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
      <script src="https://unpkg.com/peerjs@1.4.6/dist/peerjs.min.js"></script>
      <script src="index.js"></script>
    </div>
  );
}

export default App;

/* eslint eqeqeq: 0*/
