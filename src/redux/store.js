import { configureStore, combineReducers } from "@reduxjs/toolkit"
import authReducer from "./slice/auth"
import modalReducer from "./modalSlice"
import messageReducer from "./messageSlice"
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { PersistGate } from 'redux-persist/integration/react'
import languageSlice from "./languageSlice"
import userStatsReducer from "./slice/userStats"
import rewardReducer from "./slice/reward"

const rootReducer = combineReducers({ auth: authReducer, userStats: userStatsReducer, reward: rewardReducer, modal: modalReducer, message: messageReducer, lang: languageSlice })

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
}
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export let persistor = persistStore(store)