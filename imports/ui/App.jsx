import React, {Component, PropTypes} from "react";
import {Meteor} from "meteor/meteor";
import {createContainer} from "meteor/react-meteor-data";
import {Tasks} from "../api/tasks";
import Task from "./Task";
import AccountsUIWrapper from "./AccountsUIWrapper";

class App extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      hideCompleted: false,
      taskName: ""
    }
  }

  handleSubmit(event) {
    event.preventDefault();

    Meteor.call("tasks.insert", this.state.taskName);

    this.setState({taskName: ""})
  }

  updateTaskName(event) {
    this.setState({taskName: event.target.value})
  }

  toggleHideCompleted() {
    this.setState({hideCompleted: !this.state.hideCompleted})
  }

  addTaskForm() {
    if (this.props.currentUser) {
      return (
        <form className="new-task" onSubmit={this.handleSubmit.bind(this)}>
          <input
            type="text"
            value={this.state.taskName}
            onChange={this.updateTaskName.bind(this)}
            placeholder="Type to add new tasks"
          />
        </form>
      )
    }
    return null
  }

  renderTasks() {
    let tasks = this.props.tasks;
    if (this.state.hideCompleted) tasks = tasks.filter(task => !task.completed);
    return tasks.map(task => {
      return <Task key={task._id} task={task}/>;
    })
  };

  render() {
    return (
      <div className="container">
        <header>
          <h1>Todo List ({this.props.incompleteCount})</h1>

          <label className="hide-completed">
            <input
              type="checkbox"
              readOnly
              checked={this.state.hideCompleted}
              onClick={this.toggleHideCompleted.bind(this)}
            />
            Hide Completed Tasks
          </label>

          <AccountsUIWrapper/>

          {this.addTaskForm()}
        </header>
        <ul>{this.renderTasks()}</ul>
      </div>
    )
  }
}

App.propTypes = {
  tasks: PropTypes.array.isRequired,
  incompleteCount: PropTypes.number.isRequired,
  currentUser: PropTypes.object
};

export default createContainer(() => {
  return {
    tasks: Tasks.find({}, {sort: {createdAt: -1}}).fetch(),
    incompleteCount: Tasks.find({completed: {$ne: true}}).count(),
    currentUser: Meteor.user()
  };
}, App);
