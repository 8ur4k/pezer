import React, { useEffect, useState, useRef } from "react";
import logo from "./logo.svg";
import "./App.css";
import Peer, { MediaConnection } from "peerjs";

enum CallStatus {
  IDLE,
  INCOMING_CALL,
  OUTGOING_CALL,
  ON_CALL,
}

function App() {
  let currentLinkInput = useRef<HTMLInputElement>(null);
  let auido1 = useRef<HTMLAudioElement>(null);
  let ringtone = useRef<HTMLAudioElement>(null);
  let amogus = useRef<HTMLAudioElement>(null);
  let currentCall = useRef<MediaConnection | null>(null);

  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.IDLE);

  function copyToClipboard(str: string) {
    if (navigator && navigator.clipboard && navigator.clipboard.writeText)
      return navigator.clipboard.writeText(str);
    return Promise.reject("The Clipboard API is not available.");
  }

  function pezerle() {
    console.log("pezerle");
    setCallStatus(CallStatus.ON_CALL);
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        console.log({ currentCall });
        currentCall?.current?.answer(stream); // Answer the call with an A/V stream.
        currentCall?.current?.on("stream", (remoteStream) => {
          if (auido1.current) auido1.current.srcObject = remoteStream;
          console.log("answer");
        });
      })
      .catch((err) => {
        console.error("Failed to get local stream", err);
      });
  }

  const genRand = (len: number) => {
    return Math.random()
      .toString(36)
      .substring(2, len + 2);
  };

  useEffect(() => {
    console.log("useEffect");
    const queryParams = new URLSearchParams(document.location.search);
    const callAdress = queryParams.get("to");
    const clientAddress = genRand(7);
    const baseUrl = "http://localhost:3000/";

    if (currentLinkInput.current) {
      currentLinkInput.current.value = `${baseUrl}?to=${clientAddress}`;
    }

    const peer = new Peer(clientAddress);

    peer.on("call", (call) => {
      setCallStatus(CallStatus.INCOMING_CALL);
      currentCall.current = call;
      console.log("sdfsdfgsdffsd");
    });

    setTimeout(() => {
      console.log("denemneee??" + callAdress);
      if (callAdress) {
        navigator.mediaDevices.getUserMedia({ audio: true }).then(
          (stream) => {
            const call = peer.call(callAdress, stream);
            call.on("stream", (remoteStream) => {
              console.log("denemneee!" + callStatus);
            });
          },
          (err) => {
            console.error("Failed to get local stream", err);
          }
        );
      }
    }, 1000);
  }, []);

  return (
    <div className="body">
      <div className="container">
        <h1>PE2ER</h1>
        <p>Ne biçim konuşuyon pezer mezer.</p>
        <div className="clientLogin">
          <div className="clienInput">
            <input
              ref={currentLinkInput}
              type="text"
              disabled
              placeholder="Connection link"
            />
          </div>
          <input
            onClick={() =>
              copyToClipboard(
                currentLinkInput.current ? currentLinkInput.current?.value : ""
              )
            }
            className="clientSubmitButton"
            type="button"
            value="Copy"
          />
        </div>
        {callStatus == CallStatus.INCOMING_CALL && (
          <div className="copyLink">
            <input
              className="copyLinkButton"
              type="button"
              onClick={() => pezerle()}
              value="P E Z E R L E!"
            />
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
        {callStatus == CallStatus.ON_CALL && (
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
