import React from 'react'
import {Button, Card} from "react-bootstrap";
import '../style/style.css'

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: 'Farzana Hameed',
            key: '86d24e37073cf3fb'
        }
    }

    componentDidMount() {

    }

    handleChange = (e) =>{
        this.setState({[e.target.name]: e.target.value});
    };

    render() {
        return (
            // <div style={{height:'100vh'}}>
                <div className='container-fluid container-main'>
                    <div>
                        <Card className='p-4 login-card card-8 radius10'>
                            <span className='mb-2 font-weight-bold text-left'>Login</span>
                            <input type="key" className="form-control mb-3" placeholder="Id" name="key" value={this.state.key} onChange={(e) =>this.handleChange(e)}/>
                            <input type="name" className="form-control mb-3" placeholder="Name" name="name" value={this.state.name} onChange={(e) =>this.handleChange(e)}/>
                            <Button className='mb-3' onClick={() => this.props.onLoginSuccess(this.state.name, this.state.key)}> Login</Button>

                        </Card>
                    </div>
                </div>
            // </div>
        )
    }
}

export default Login;