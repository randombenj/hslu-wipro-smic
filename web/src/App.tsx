import './App.css';

import { CachePolicies, Provider } from "use-http";
import VoltageGraph from './components/voltageGraph';
function App() {

  return (
    <div className="App">
      <Provider url="http://localhost:8000/" options={{ cacheLife: 0, cachePolicy: CachePolicies.NO_CACHE }}>
        <header className="App-header">
          <VoltageGraph></VoltageGraph>
        </header>
      </Provider>
    </div>
  );


}

export default App;
