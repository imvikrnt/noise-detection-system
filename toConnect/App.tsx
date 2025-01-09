import React from 'react';
import ProApp from './src/ProApp';
import { Provider } from 'react-redux';
import store from './src/reduxStore/store';
function App(): React.JSX.Element {
  return (
    <Provider store={store}>
        <ProApp/>
    </Provider>
  );
  // return (
    
  //       <ProApp/>
  // );
}

export default App;
