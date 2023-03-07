export const initialHostState = (set: any) => ({
  hostID: Math.random()
    .toString(36)
    .substring(2, 7 + 2),
  hostCam: null,
  hostMic: null,
  hostScreenShare: null,
  setHostCam: (hostCamElement: any) =>
    set(() => ({
      hostCam: hostCamElement,
    })),
  setHostMic: (hostMicElement: any) =>
    set(() => ({
      hostMic: hostMicElement,
    })),
  setHostScreenShare: (hostScreenShareElement: any) =>
    set(() => ({
      hostScreenShare: hostScreenShareElement,
    })),
});

export const initialNotHostState = (set: any) => ({
  notHostID: null,
  notHostCam: null,
  notHostMic: null,
  notHostScreenShare: null,
  setNotHostCam: (notHostCamElement: any) =>
    set(() => ({
      notHostCam: notHostCamElement,
    })),
  setNotHostMic: (notHostMicElement: any) =>
    set(() => ({
      notHostMic: notHostMicElement,
    })),
  setNotHostScreenShare: (notHostScreenShareElement: any) =>
    set(() => ({
      notHostScreenShare: notHostScreenShareElement,
    })),
});
