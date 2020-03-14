import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './app/screen/login';
import Home from './app/screen/home';


class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLogin: false
        }
    }


    loginSuccessHandler = () => {
        this.setState({isLogin: true})
    }

    render() {
        return (
            this.state.isLogin ? <Home/> : <Login onLoginSuccess = {this.loginSuccessHandler}/>
        )
    }

}
export default App;