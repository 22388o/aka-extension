import { configureStore } from "@reduxjs/toolkit";
import relaysReducer from "../common/model/relaySlice";

export const store = configureStore({
  reducer: {
    relays: relaysReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
