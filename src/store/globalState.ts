import { create } from "zustand";

interface GlobalState {
  callStatus: "IDLE" | "INCOMING_CALL" | "OUTGOING_CAL" | "ON_CALL";
}

export const useGlobalState = create<GlobalState>(() => ({
  callStatus: "IDLE",
}));
