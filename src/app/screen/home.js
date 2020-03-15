import React from 'react'
import {
    Button,
    Card,
    FormCheck,
    FormControl,
    InputGroup,
    Modal,
    ModalBody,
    ModalFooter,
    Navbar,
    Spinner
} from "react-bootstrap";
import { IoMdAdd } from "react-icons/io";
import {performRequest} from "../ services/apiHandler";
import { GoPencil } from "react-icons/go";
import { FaTrashAlt, FaSearch } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import ReactMinimalPieChart from "react-minimal-pie-chart";

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            new_task_modal: false,
            delete_task_modal: false,
            edit_task_modal: false,
            name: '',
            search: '',
            image: '',
            total_tasks: 0,
            tasks_completed: 0,
            tasks: [],
            latest_tasks: [],
            tasks_backup: [],
            new_task_name:'',
            edit_task_name: '',
            task_error: '',
            selected_task: {},
            selected_index: 0,
            width: 0,
            height: 0,
            loader: false
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);

        let user_data = JSON.parse(localStorage.getItem("isLogin"));
        this.setState({name: user_data.token.name,
            loader: true,
            image: 'https://dev.teledirectasia.com:3092/'+ user_data.image})

        performRequest('get', '/dashboard' )
            .then(response => {
                console.log("HOME", response)
                this.setState({total_tasks: response.data.totalTasks,
                    tasks_completed: response.data.tasksCompleted,
                    latest_tasks: response.data.latestTasks
                })
            })
            .catch(error =>{
            this.setState({loader: false})
        });

        performRequest('get', '/tasks' )
            .then(response => {
                console.log("HOME2", response)
                this.setState({tasks: response.data.tasks,
                    loader: false
                })
            }).catch(error =>{
                this.setState({loader: false})
        });
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

    closeHandle = (name) =>{
        this.setState({[name]: false})
    };

    deleteHandler = (task, index) =>{
        this.setState({
            delete_task_modal: true,
            edit_task_name: task.name,
            selected_task: task,
            selected_index: index
        });
    };

    saveTask = () =>{
        performRequest('post', '/task', {name: this.state.new_task_name} )
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
        if (this.state.edit_task_name !== ""){
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
                this.setState({task_error: error.response.data.msg,
                    delete_task_modal: false
                });
            })
        };

    };

    deleteTask = () => {
        performRequest('delete', '/task/'+ this.state.selected_task._id)
            .then(response => {
                console.log("HOME 5", response)
                this.state.tasks.splice(this.state.selected_index, 1);
                let tasks = [];
                let i = 0;
                this.state.tasks.map(item =>{
                        item.completed && i++;
                        tasks.push(item)
                    }
                );
                this.setState({
                    tasks_completed: i,
                    delete_task_modal: false,
                    edit_task_name: '',
                    task_error: '',
                    tasks: tasks,
                    total_tasks: tasks.length
                })
            }).catch(error=>{
            this.setState({task_error: error.response.data.msg,
                delete_task_modal: false
            });
        })
    };

    render() {
        const search_text = this.state.search.toLowerCase();
        const completedPercentage = (this.state.tasks_completed * 100) / this.state.total_tasks;
        return (
            this.state.loader ?
                <div className='container-main'>
                    <Spinner animation="grow" size='lg' className='spinner'/>
                </div>
                :
            <div className='pb-5'>
                <Navbar className='custom-nav card-8 mb-4'>
                    <div>
                        <img src={this.state.image} width={50} height={50} className='rounded-circle mr-2 ml-3 object-fit'/>
                        <span className='font-weight-bold'>{this.state.name}</span>
                    </div>
                    <span className='logout' onClick={this.props.logoutSuccess}>Logout</span>
                </Navbar>

                {this.state.tasks.length > 0 ?
                    <div className='container'>
                        <div className='row mb-2'>
                            <div className='col-lg-4 col-md-4 col-sm-12 mb-3'>
                                <Card className='p-4 card-8 radius10 card-height'>
                                    <span className='mb-3 text-center card-heading'>Tasks completed</span>
                                    <span className='task-completed'>{this.state.tasks_completed} <span className='task-total'>/{this.state.total_tasks}</span></span>
                                </Card>
                            </div>
                            <div className='col-lg-4 col-md-4 col-sm-12 mb-3'>
                                <Card className='p-3 card-8 radius10 card-height'>
                                    <span className='mb-3 text-center card-heading'>Latest Created Tasks</span>
                                    <ul className='pl-3'>
                                        {this.state.latest_tasks.map(item=>
                                            <li className='mb-0 latest-task'>{item.name}</li>
                                        )}
                                    </ul>
                                </Card>
                            </div>
                            <div className='col-lg-4 col-md-4 col-sm-12 mb-3'>
                                <Card className='card-8 radius10 card-height'>
                                    <ReactMinimalPieChart
                                        animate={true}
                                        animationDuration={500}
                                        animationEasing="ease-out"
                                        totalValue={100}
                                        data={[
                                            {
                                                color: '#E8ECEC',
                                                title: 'Incompleted tasks',
                                                value: 100 - completedPercentage
                                            },
                                            {
                                                color: '#5285ec',
                                                title: 'Completed tasks',
                                                value: completedPercentage
                                            }
                                        ]}
                                        label={false}
                                        lengthAngle={360}
                                        lineWidth={100}
                                        paddingAngle={0}
                                        radius={this.state.width < 768 ? 10 : 20}
                                        style={{marginTop: this.state.width < 478 ? -100 : (this.state.width < 768 ? -170 : (this.state.width < 992 ? -24 : (this.state.width < 1200 ? -60 : -90)))}}
                                        rounded={false}
                                        startAngle={90}
                                    />
                                    {console.log(this.state.width)}
                                </Card>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-lg-6 col-sm-12 mb-sm-3 task-title'>
                                <span>Tasks</span>
                            </div>
                            <div className='col-lg-4 col-sm-12 mb-sm-3 mb-3 mb-lg-0'>
                                <InputGroup>
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1" className='search-icon-container'>
                                            <FaSearch size={15} color={'#647278'}/></InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl
                                        className='search-input'
                                        placeholder="Search by task name"
                                        value={this.state.search}
                                        name="search"
                                        onChange={(e) =>this.handleChange(e)}
                                    />
                                </InputGroup>
                            </div>
                            <div className='col-lg-2 col-sm-12 mb-3 mb-lg-0'>
                                <Button onClick={()=>this.setState({new_task_modal: true})}><IoMdAdd size={13} className='mb-1'/> New Task</Button>
                            </div>
                        </div>

                        <Card className='mb-5 card-8 radius10'>
                            {this.state.tasks.map((item, index) =>{
                                if (item.name.toLowerCase().search(search_text) !== -1) {
                                return(
                                <div className='row task-row mr-0 ml-0'>
                                    <div className={[item.completed ? 'col-lg-10 pl-0 d-flex decoration' : 'col-lg-10 pl-0 d-flex ']}>
                                        <FormCheck className='mr-3' checked={item.completed} type="checkbox" onClick={()=> this.checkHandle(item, index)}/>
                                        {item.name}
                                    </div>
                                    <div className='col-lg-2 text-right'>
                                        <GoPencil size={20} color={'#647278'} className='mr-3 pointer' onClick={() => this.editHandle(item, index)}/>
                                        <FaTrashAlt className='pointer' color={'#647278'} size={20} onClick={() => this.deleteHandler(item, index)}/>
                                    </div>

                                </div>
                                )}
                            }
                            )}
                        </Card>
                    </div>
                    :
                    <div className='container-main'>
                        <div className='row col-sm-12 col-md-6 col-lg-4'>
                            <Card className='p-4 card-8 login-card radius10'>
                                <span className='mb-3 text-center'>You have no task.</span>
                                <Button className='mb-2' onClick={()=>this.setState({new_task_modal: true})}><IoMdAdd size={13} /> New Task</Button>
                            </Card>
                        </div>
                    </div>
                }

                <Modal show={this.state.new_task_modal}>
                    <Card className='p-4'>
                        <MdClose size={20} className='mb-1 mr-1 close-btn' onClick={()=>this.closeHandle("new_task_modal")}/>
                        <span className='mb-3 text-center'><IoMdAdd size={15} />New Task</span>
                        <input type="name" className="form-control" placeholder="Task Name" name="new_task_name" required
                               value={this.state.new_task_name} onChange={(e)=> this.handleChange(e)}/>
                        {this.state.task_error && <span className='error-msg'>{this.state.task_error}</span>}
                        <Button className='mb-2 mt-3' onClick={this.saveTask}><IoMdAdd size={13} /> New Task</Button>
                    </Card>
                </Modal>

                <Modal show={this.state.edit_task_modal}>
                    <Card className='p-4'>
                        <MdClose size={20} className='mb-1 mr-1 close-btn' onClick={()=>this.closeHandle("edit_task_modal")}/>
                        <span className='mb-3'><GoPencil size={15} className='mb-1 mr-1'/>Edit Task</span>
                        <input type="name" className="form-control" placeholder="Task Name" name="edit_task_name" required
                               value={this.state.edit_task_name} onChange={(e)=> this.handleChange(e)}/>
                        {this.state.task_error && <span className='error-msg'>{this.state.task_error}</span>}
                        <Button className='mb-2 mt-3' onClick={this.editTask}><GoPencil size={13} className='mb-1 mr-1'/> Edit Task</Button>
                    </Card>
                </Modal>

                <Modal show={this.state.delete_task_modal}>
                    <ModalBody>
                        <span className='mb-3'>Are you sure to delete this Task?</span>
                    </ModalBody>
                    <ModalFooter>
                        <Button className='mb-2' onClick={()=>this.setState({delete_task_modal: false})}>Cancel</Button>
                        <Button className='mb-2' variant="danger" onClick={this.deleteTask}><FaTrashAlt size={13} className='mb-1 mr-1'/> Delete Task</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default Home;