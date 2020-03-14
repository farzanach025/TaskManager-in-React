import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './app/screen/login';
import Home from './app/screen/home';
import {BrowserRouter as Router, Route} from "react-router-dom";
import {performRequest} from "./app/ services/apiHandler";

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLogin: false,

        }
    }
    componentDidMount() {
        if (localStorage.getItem("accessToken")){
            this.setState({
                isLogin:true
            })
        }
    }


    loginSuccessHandler = ( name, key) => {
        let data = {
            "name": name,
            "apiKey": key
        };
        performRequest('post', '/login', data )
            .then(response => {
                console.log(response.data.token.token, "response", response)
                localStorage.setItem("accessToken", response.data.token.token)
                localStorage.setItem("isLogin", JSON.stringify(response.data));
                this.setState({isLogin: true})
            })
    };

    logoutHandler = () => {
        this.setState({isLogin: false})
        localStorage.clear()
    };


    render() {
        return (
            <div className='bg-color'>
                {this.state.isLogin ?
                    <Home
                        logoutSuccess = {this.logoutHandler}
                    />
                :
                    <Login
                        onLoginSuccess = {this.loginSuccessHandler}
                    />}
            </div>

        )
    }

// <Router>
// <div>
// {/*<Redirect exact to={'/'} from={'/:uuid'}/>*/}
// <Route exact path="/Login" component={Login}/>
// <Route exact path="/home" component={Home}/>
// </div>
// </Router>

}
export default App;