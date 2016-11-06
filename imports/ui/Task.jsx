import React, {Component, PropTypes} from "react";
import {Meteor} from "meteor/meteor";
import classNamesHandler from "classnames";

export default class Task extends Component {
  toggleCompleted() {
    Meteor.call("tasks.update", this.props.task._id, "completed", !this.props.task.completed);
  }

  togglePrivate() {
    Meteor.call("tasks.update", this.props.task._id, "private", !this.props.task.private);
  }

  deleteTask() {
    Meteor.call("tasks.remove", this.props.task._id);
  }

  taskAuthor() {
    if (this.props.task.username) return `${this.props.task.username}: `;
  }

  privateButton() {
    if (this.props.ownedByCurrent) {
      return (
        <button className="toggle-private" onClick={this.togglePrivate.bind(this)}>
          {this.props.task.private ? "is Private" : "is Public"}
        </button>
      )
    }
  }

  render() {
    const taskClassName = classNamesHandler({
      checked: this.props.task.completed,
      private: this.props.task.private,
    });

    return (
      <li className={taskClassName}>
        { this.props.ownedByCurrent ? (
          <button className="delete" onClick={this.deleteTask.bind(this)}>
            &times;
          </button>
          ) : ''
        }

        <input
          type="checkbox"
          readOnly
          defaultChecked={this.props.task.completed}
          onClick={this.toggleCompleted.bind(this)}
        />

        {this.privateButton()}

        <span className="text">
          {this.taskAuthor()}{this.props.task.text}
        </span>
      </li>
    );
  }
}

Task.propTypes = {
  task: PropTypes.object.isRequired,
  ownedByCurrent: PropTypes.bool.isRequired
};
