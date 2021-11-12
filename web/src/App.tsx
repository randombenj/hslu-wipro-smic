import './App.css';

import { CachePolicies, Provider } from "use-http";
import Body from './components/body';
import DateAdapter from '@mui/lab/AdapterLuxon';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { QueryParamProvider } from 'use-query-params';
function App() {
  return (
    <LocalizationProvider dateAdapter={DateAdapter}>
      <QueryParamProvider>
        <Provider url="http://localhost:8888/api/" options={{ cacheLife: 0, cachePolicy: CachePolicies.NO_CACHE }}>
          <Body></Body>
        </Provider>
      </QueryParamProvider>
    </LocalizationProvider>
  );


}

export default App;
