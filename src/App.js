import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import SignUp from "./components/auth/SignUp";
import Home from "./components/home/Home";
import TeamTodo from "./components/todo/TeamTodo";
import Slogger from "./components/slogger/Slogger";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./PrivateRoute";

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Switch>
            <Route exact path="/signUp" component={SignUp} />
            <Route exact path="/slogger" component={Slogger} />
            <PrivateRoute exact path="/" component={Home} />
            <PrivateRoute path="/:teamName" component={Home} />
          </Switch>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
