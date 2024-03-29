import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./PrivateRoute";
import signUpLoader from "./assets/images/signUpLoader.gif";
import Extension from "./components/slogger/Extension";
const Home = React.lazy(() => import("./components/home/Home"));
const SignUp = React.lazy(() => import("./components/auth/SignUp"));
const Slogger = React.lazy(() => import("./components/slogger/Slogger"));
const HelpPage = React.lazy(() => import("./components/helpPage/HelpPage"));
const ContactUs = React.lazy(() => import("./components/slogger/ContactUs"));

function App() {
  return (
    <div className="App">
      <React.Suspense
        fallback={
          <div
            style={{
              height: "100vh",
              width: "100vw",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img src={signUpLoader} style={{ transform: "scale(0.3)" }} />
          </div>
        }
      >
        <Router>
          <AuthProvider>
            <Switch>
              <Route exact path="/signUp" component={SignUp} />
              <Route exact path="/" component={Slogger} />
              <Route exact path="/help" component={HelpPage} />
              <Route exact path="/contactUs" component={ContactUs} />
              <Route exact path="/extension" component={Extension} />
              <PrivateRoute exact path="/home" component={Home} />
              <PrivateRoute path="/home/:teamName" component={Home} />
            </Switch>
          </AuthProvider>
        </Router>
      </React.Suspense>
    </div>
  );
}

export default App;
