import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../popup/store";

export interface IRelay {
  url: string;
  read: boolean;
  write: boolean;
}

// Define a type for the slice state
interface RelayState {
  relays: IRelay[];
}

// Define the initial state using that type
const initialState: RelayState = {
  relays: [{ url: "my.relay", read: true, write: false }],
};

export const relaysSlice = createSlice({
  name: "relays",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    add: (state, action: PayloadAction<IRelay>) => {
      state.relays.push(action.payload);
    },
    remove: (state, action: PayloadAction<string>) => {
      let url = action.payload;
      let i = -1;
      for (i = 0; i < state.relays.length; i++) {
        if (state.relays[i].url === url) break;
      }
      if (i >= 0 && i < state.relays.length) {
        state.relays.splice(i);
      }
    },
  },
});

export const { add, remove } = relaysSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectRelays = (state: RootState) => state.relays.relays;

export default relaysSlice.reducer;
