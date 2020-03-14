import React from 'react'
import {Button, Card, FormCheck, Modal, Navbar} from "react-bootstrap";
import { IoMdAdd } from "react-icons/io";
import {performRequest} from "../ services/apiHandler";
import { GoPencil } from "react-icons/go";
import { FaTrashAlt } from "react-icons/fa";

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            new_task_modal: false,
            name: '',
            image: '',
            total_tasks: 0,
            tasks_completed: 0,
            tasks: [],
            latest_tasks: [],
            new_task_name:'',
            edit_task_name: '',
            task_error: '',
            selected_task: {},
            selected_index: 0
        }
    }

    componentDidMount() {
        let user_data = JSON.parse(localStorage.getItem("isLogin"));
        this.setState({name: user_data.token.name,
        image: 'https://dev.teledirectasia.com:3092/'+ user_data.image})

        performRequest('get', '/dashboard' )
            .then(response => {
                console.log("HOME", response)
                this.setState({total_tasks: response.data.totalTasks,
                    tasks_completed: response.data.tasksCompleted,
                    latest_tasks: response.data.latestTasks
                })
            });

        performRequest('get', '/tasks' )
            .then(response => {
                console.log("HOME2", response)
                this.setState({tasks: response.data.tasks})
            })
    }

    handleChange = (e) =>{
        this.setState({[e.target.name]: e.target.value});
    };

    editHandle = (task, index) =>{
        console.log(index, "  EDIT  ")
        this.setState({edit_task_modal: true,
            edit_task_name: task.name,
            selected_task: task,
            selected_index: index
        })
    };

    checkHandle = (task, index) =>{
        task.completed = !task.completed
        this.setState({
            edit_task_name: task.name,
            selected_task: task,
            selected_index: index
        }, () => {
            this.editTask();
        });
    };

    saveTask = () =>{
        performRequest('post', '/task', {name: this.state.new_task} )
            .then(response => {
                console.log("HOME 3", response)
                let tasks = [];
                this.state.tasks.map(item =>
                    tasks.push(item)
                );
                tasks.push(response.data.task)
                this.setState({new_task_modal: false,
                    new_task_name: '',
                    task_error: '',
                    tasks: tasks,
                    total_tasks: tasks.length
                })
            }).catch(error=>{
                this.setState({task_error: error.response.data.msg});
        })
    };

    editTask = () =>{
        let data = {
            "name": this.state.edit_task_name,
            "completed": this.state.selected_task.completed
        };
        performRequest('put', '/task/'+ this.state.selected_task._id, null, data)
            .then(response => {
                console.log("HOME 4", response)
                let tasks = [];
                let i = 0;
                this.state.tasks.map(item =>{
                    item.completed && i++;
                    tasks.push(item)
                }
                );
                tasks[this.state.selected_index] = response.data.task;
                this.setState({
                    tasks_completed: i,
                    edit_task_modal: false,
                    edit_task_name: '',
                    task_error: '',
                    tasks: tasks
                })
            }).catch(error=>{
            this.setState({task_error: error.response.data.msg});
        })
    };

    deleteTask = () => {

    };

    render() {
        console.log("image", this.state.image)
        return (
            <div>
                <Navbar className='custom-nav card-8 mb-4'>
                    <div>
                        <img src={this.state.image} width={50} height={50} className='rounded-circle mr-2 ml-3 object-fit'/>
                        <span className='font-weight-bold'>{this.state.name}</span>
                    </div>
                    <span className='logout' onClick={this.props.logoutSuccess}>Logout</span>
                </Navbar>

                {this.state.tasks.length > 0 ?
                    <div className='container'>
                        <div className='row'>
                            <div className='col-lg-4 col-md-4 col-sm-12 mb-3'>
                                <Card className='p-4 card-8 radius10'>
                                    <span className='mb-3 text-center card-heading'>Tasks completed</span>
                                    <span className='task-completed'>{this.state.tasks_completed} <span className='task-total'>/{this.state.total_tasks}</span></span>
                                </Card>
                            </div>
                            <div className='col-lg-4 col-md-4 col-sm-12 mb-3'>
                                <Card className='p-3 card-8 radius10'>
                                    <span className='mb-3 text-center card-heading'>Latest Created Tasks</span>
                                    <ul className='pl-3'>
                                        {this.state.latest_tasks.map(item=>
                                            <li className='mb-0 latest-task'>{item.name}</li>
                                        )}
                                    </ul>
                                </Card>
                            </div>
                            <div className='col-lg-4 col-md-4 col-sm-12 mb-3'>
                                <Card className='p-4 card-8 radius10'>
                                    <span className='mb-3 text-center'>Tasks completed</span>
                                    <span className='task-completed'>5 <span className='task-total'>/20</span></span>
                                </Card>
                            </div>
                        </div>
                        <Button className='mb-2' onClick={()=>this.setState({new_task_modal: true})}><IoMdAdd size={13} /> New Task</Button>

                        <Card className='mb-5 card-8 radius10'>
                            {this.state.tasks.map((item, index) =>
                                <div className='row task-row mr-0 ml-0'>
                                    <div className={[item.completed ? 'col-lg-10 pl-0 d-flex decoration' : 'col-lg-10 pl-0 d-flex ']}>
                                        <FormCheck className='mr-3' checked={item.completed} type="checkbox" onClick={()=> this.checkHandle(item, index)}/>
                                        {item.name}
                                    </div>
                                    <div className='col-lg-2 text-right'>
                                        <GoPencil size={20} color={'#647278'} className='mr-3 pointer' onClick={() => this.editHandle(item, index)}/>
                                        <FaTrashAlt color={'#647278'} size={20}/>
                                    </div>

                                </div>
                            )}
                        </Card>
                    </div>
                    :
                    <div className='container-main'>
                        <Card className='p-4 card-8 login-card radius10'>
                            <span className='mb-3 text-center'>You have no task.</span>
                            <Button className='mb-2' onClick={()=>this.setState({new_task_modal: true})}><IoMdAdd size={13} /> New Task</Button>
                        </Card>
                    </div>
                }

                <Modal show={this.state.new_task_modal}>
                    <Card className='p-4 radius10'>
                        <span className='mb-3 text-center'><IoMdAdd size={15} />New Task</span>
                        <input type="name" className="form-control" placeholder="Task Name" name="new_task_name" required
                               value={this.state.new_task_name} onChange={(e)=> this.handleChange(e)}/>
                        {this.state.task_error && <span className='error-msg'>{this.state.task_error}</span>}
                        <Button className='mb-2 mt-3' onClick={this.saveTask}><IoMdAdd size={13} /> New Task</Button>
                    </Card>
                </Modal>

                <Modal show={this.state.edit_task_modal}>
                    <Card className='p-4 radius10'>
                        <span className='mb-3'><GoPencil size={15} className='mb-1 mr-1'/>Edit Task</span>
                        <input type="name" className="form-control" placeholder="Task Name" name="edit_task_name" required
                               value={this.state.edit_task_name} onChange={(e)=> this.handleChange(e)}/>
                        {this.state.task_error && <span className='error-msg'>{this.state.task_error}</span>}
                        <Button className='mb-2 mt-3' onClick={this.editTask}><GoPencil size={13} className='mb-1 mr-1'/> Edit Task</Button>
                    </Card>
                </Modal>
            </div>
        )
    }
}

export default Home;