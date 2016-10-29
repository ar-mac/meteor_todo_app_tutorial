import React, {Component, PropTypes} from "react";
import {createContainer} from "meteor/react-meteor-data";
import {Tasks} from "../api/tasks";
import Task from "./Task.jsx";

class App extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      taskName: ""
    }
  }

  handleSubmit(event) {
    event.preventDefault();

    Tasks.insert({
      text: this.state.taskName,
      createdAt: new Date()
    });

    this.setState({taskName: ""})
  }

  updateTaskName(event) {
    this.setState({taskName: event.target.value})
  }

  renderTasks() {
    return this.props.tasks.map(task => {
      return <Task key={task._id} task={task}/>;
    })
  };

  render() {
    return (
      <div className="container">
        <header>
          <h1>Todo List</h1>

          <form className="new-task" onSubmit={this.handleSubmit.bind(this)}>
            <input
              type="text"
              value={this.state.taskName}
              onChange={this.updateTaskName.bind(this)}
              placeholder="Type to add new tasks"
            />
          </form>
        </header>
        <ul>{this.renderTasks()}</ul>
      </div>
    )
  }
}

App.propTypes = {
  tasks: PropTypes.array.isRequired
};

export default createContainer(() => {
  return {
    tasks: Tasks.find({}, {sort: {createdAt: -1}}).fetch()
  };
}, App);
