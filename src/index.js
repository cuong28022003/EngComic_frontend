import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {store,persistor} from './redux/store'
import {Provider} from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import UploadChuong from './components/UploadChapter'
import DocChuong from './components/DocChuong';
ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      {/* <DocChuong chuongId="674d29d520f0b776f3387a09"/> */}
      <App/>
    </PersistGate>
    
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals