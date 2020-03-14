import React from 'react'
import {Button, Card} from "react-bootstrap";
import '../style/style.css'

class Login extends React.Component{
    constructor(props) {
        super(props);
    }
    render() {
        return(
            <div className='container-fluid container-main'>
                <Card className='p-4'>
                    <span className='mb-2 font-weight-bold '>Login</span>
                    <input type="id" className="form-control mb-3" placeholder="Id" id="id"/>
                    <input type="name" className="form-control mb-3" placeholder="Name" id="name"/>
                    <Button className='mb-3' onClick={this.props.onLoginSuccess}> Login</Button>

                </Card>
            </div>
        )
    }
}
export default Login;