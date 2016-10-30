import React, {Component, PropTypes} from "react";
import {Tasks} from "../api/tasks";

export default class Task extends Component {
  toggleCompleted() {
    Tasks.update(this.props.task._id, {
      $set: {completed: !this.props.task.completed}
    });
  };

  deleteTask() {
    Tasks.remove(this.props.task._id);
  }

  render() {
    const taskClassName = this.props.task.completed ? 'checked' : '';

    return (
      <li className={taskClassName}>
        <button className="delete" onClick={this.deleteTask.bind(this)}>
          &times;
        </button>

        <input
          type="checkbox"
          readOnly
          defaultChecked={this.props.task.completed}
          onClick={this.toggleCompleted.bind(this)}
        />

        <span className="text">{this.props.task.text}</span>
      </li>
    );
  }
}

Task.propTypes = {
  task: PropTypes.object.isRequired
};
