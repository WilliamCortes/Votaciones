import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import "antd/dist/antd.css";
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute } from './auth/PrivateRoute';
import { Home } from "./components/Home";
import { Login } from "./auth/Login";
import { SignUp } from "./auth/SignUp";
import {HomeTable} from './components/HomeTable';

function App() {
    return (
        <>
            <Router>
                <AuthProvider>
                    <Switch>
                        <PrivateRoute exact path='/home/:haveTables' component={Home} />
                        <PrivateRoute exact path='/table/:tableId' component={HomeTable} />
                        <Route exact path='/login' component={Login} />
                        <Route exact path='/signup' component={SignUp} />
                    </Switch>
                </AuthProvider>
            </Router>
        </>
    );
}
export default App;
