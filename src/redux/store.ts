import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import userReducer from  "@/redux/slice/authSlice"
import { persistStore, persistReducer } from 'redux-persist';
import { persistConfig } from './persistConfig';

const rootReducer :any= combineReducers({
  user: userReducer,
});

const persistedReducer: any= persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
});

export const persistor = persistStore(store);

 
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
