import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import Peer, { MediaConnection } from "peerjs";
import { useGlobalState } from "./store/globalState";
import { redirect } from "react-router-dom";

function App() {
  let currentLinkInput = useRef<HTMLInputElement>(null);
  let auido1 = useRef<HTMLAudioElement>(null);
  let ringtone = useRef<HTMLAudioElement>(null);
  let amogus = useRef<HTMLAudioElement>(null);
  let currentCall = useRef<MediaConnection | null>(null);

  const callStatus = useGlobalState((state) => state.callStatus);
  const [clientAddress] = useState(
    Math.random()
      .toString(36)
      .substring(2, 7 + 2)
  );

  function copyToClipboard(str: string) {
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
    window.location.replace(window.location.origin);
    useGlobalState.setState({ callStatus: "IDLE" });
  }

  useEffect(() => {
    const callAddress = window.location.pathname.slice(1);

    const peer = new Peer(clientAddress);

    peer.on("call", (call) => {
      if (useGlobalState.getState().callStatus == "IDLE") {
        useGlobalState.setState({ callStatus: "INCOMING_CALL" });
        currentCall.current = call;
      }
    });

    setTimeout(() => {
      if (callAddress) {
        navigator.mediaDevices.getUserMedia({ audio: true }).then(
          (stream) => {
            const call = peer.call(callAddress, stream);
            call.on("stream", (remoteStream) => {
              useGlobalState.setState({ callStatus: "ON_CALL" });
            });
          },
          (err) => {
            console.error("Failed to get local stream", err);
          }
        );
      }
    }, 1000);
  }, [callStatus, clientAddress]);

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
              onClick={() =>
                copyToClipboard(
                  currentLinkInput.current
                    ? currentLinkInput.current?.value
                    : ""
                )
              }
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
      <script src="https://unpkg.com/peerjs@1.4.6/dist/peerjs.min.js"></script>
      <script src="index.js"></script>
    </div>
  );
}

export default App;

/* eslint eqeqeq: 0*/
