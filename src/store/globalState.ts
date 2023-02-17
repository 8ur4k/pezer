import {create} from 'zustand';

interface GlobalStore {
    callStatus: "IDLE" | "INCOMING_CALL" | "OUTGOING_CAL" | "ON_CALL"
}

export const useGlobalStore = create<GlobalStore>( () => ({
    callStatus: "IDLE"
}));