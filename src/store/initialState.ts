export const initialHostState = (set: any) => ({
  hostID: Math.random()
    .toString(36)
    .substring(2, 7 + 2),
  hostCam: false,
  hostMic: true,
  hostScreenShare: false,
  toggleHostCam: () =>
    set((state: any) => ({
      hostCam: !state.hostCam,
    })),
  toggleHostMic: () =>
    set((state: any) => ({
      hostMic: !state.hostMic,
    })),
  toggleHostScreenShare: () =>
    set((state: any) => ({
      hostScreenShare: !state.hostScreenShare,
    })),
});

export const initialNotHostState = (set: any) => ({
  notHostID: null,
  notHostCam: false,
  notHostMic: true,
  notHostScreenShare: false,
  toggleNotHostCam: () =>
    set((state: any) => ({
      notHostCam: !state.notHostCam,
    })),
  toggleNotHostMic: () =>
    set((state: any) => ({
      notHostMic: !state.notHostMic,
    })),
  toggleNotHostScreenShare: () =>
    set((state: any) => ({
      notHostScreenShare: !state.notHostScreenShare,
    })),
});

export const initialCallState = (set: any) => ({
  callStatus: "IDLE",
  setCallStatus: (status: any) =>
    set(() => ({
      callStatus: status,
    })),
});
