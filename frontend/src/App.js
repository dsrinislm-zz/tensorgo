import React from 'react';
import './App.css';
import { BrowserRouter as OutletRouter } from 'react-router-dom-next';
import store from './redux/store';
import RouterOutput from './routes';
import { Provider } from 'react-redux';
const App = (props) => {
  return (
    <OutletRouter>
      <Provider store={store}>
        <RouterOutput navbar={true} title="Manage Tensorgo Users" />
      </Provider>
    </OutletRouter>
  );
};

export default App;
