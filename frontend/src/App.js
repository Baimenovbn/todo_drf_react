import React from 'react';
import logo from './logo.svg';
import './App.css';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            todoList: [],
            activeItem: {
                id: null,
                title: '',
                isCompleted: false,
            },
            isEditing: false,
        };
    }

    componentWillMount() {
        this.fetchTasks();
    }

    async fetchTasks() {
        let url = 'http://127.0.0.1:8000/api/task-list/';

        let response = await fetch(url);
        let tasks = await response.json();
        this.setState({
            todoList: tasks
        });
    }

    handleChange = (e) => {
        let value = e.target.value;

        this.setState({
            activeItem: {
                ...this.state.activeItem,
                title: value
            }
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();

        let url = 'http://127.0.0.1:8000/api/task-create/'

        if (this.state.isEditing) {
           url = `http://127.0.0.1:8000/api/task-update/${this.state.activeItem.id}/`;
           this.setState({
               isEditing: false,
           });
        }

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.state.activeItem)
        })
        .then(response => {
            this.fetchTasks();
            this.setState({
                activeItem: {
                    id: null,
                    title: '',
                    isCompleted: false,
                }
            });
        })
        .catch(error => console.log('ERROR:', error));
    }


    startEdit(task) {
        this.setState({
            activeItem: task,
            isEditing: true,
        })
    }

    toggleCompletion(task) {
        task.isCompleted = !task.isCompleted;
        let url = `http://127.0.0.1:8000/api/task-update/${task.id}/`;

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({...task})
        })
        .then(response => {
            this.fetchTasks();
        })
    }

    deleteTask(id) {
        let url = `http://127.0.0.1:8000/api/task-delete/${id}/`;

        fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            let row = document.querySelector(`div[data-rowid="${id}"]`);
            row.remove();
        });
    }

    render() {
        let tasks = this.state.todoList;
        let self = this;
        return (
            <div className="container">
                <div id="task-container">
                    <div id="form-wrapper">
                        <form onSubmit={this.handleSubmit} id="form">
                            <div className="flex-wrapper">

                                <div style={{ flex: 6 }}>
                                    <input onChange={this.handleChange} className="form-control" id="title" type="text" name="title" placeholder="Add Task..." value={this.state.activeItem.title}/>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <input className="btn btn-warning" id="submit" type="submit" name="add" />
                                </div>

                            </div>
                        </form>
                    </div>
                    <div id="list-wrapper">
                        { tasks.map((task, index) => {
                            return(
                                <div key={index} data-rowid={task.id} className="task-wrapper flex-wrapper">

                                    <div onClick={() => this.toggleCompletion(task)} style={{flex:7}}>
                                        {!task.isCompleted ? (
                                            <span>{task.title}</span>
                                        ) : (
                                            <strike>{task.title}</strike>
                                        )}
                                    </div>

                                    <div style={{flex:1}}>
                                        <button onClick={() => self.startEdit(task)} className="btn btn-sm btn-outline-info edit">Edit</button>
                                    </div>

                                    <div style={{flex:1}}>
                                        <button onClick={() => this.deleteTask(task.id)} className="btn btn-sm btn-outline-dark delete">Delete</button>
                                    </div>

                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    }
}

export default App;
