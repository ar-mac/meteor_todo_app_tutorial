import React, {Component, PropTypes} from "react";

export default class Task extends Component {
  toggleCompleted() {
    Meteor.call("tasks.setCompleted", this.props.task._id, !this.props.task.completed);
  }

  deleteTask() {
    Meteor.call("tasks.remove", this.props.task._id);
  }

  taskAuthor() {
    if (this.props.task.userName) return `${this.props.task.userName}: `;
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

        <span className="text">
          {this.taskAuthor()}{this.props.task.text}
        </span>
      </li>
    );
  }
}

Task.propTypes = {
  task: PropTypes.object.isRequired
};
