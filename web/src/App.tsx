import './App.css';

import { CachePolicies, Provider } from "use-http";
import Body from './components/body';

function App() {
  return (
    <Provider url="http://localhost:8888/api/" options={{ cacheLife: 0, cachePolicy: CachePolicies.NO_CACHE }}>
      <Body></Body>
    </Provider>
  );


}

export default App;
