import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router } from "react-router-dom";
import Routs from './routes/Routs';
// import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
        <Router>
          <Navbar />
          <Routs />
        </Router>
    </div>
  );
}

export default App;