import {Meteor} from "meteor/meteor";
import {Mongo} from "meteor/mongo";
import {check} from "meteor/check";

export const Tasks = new Mongo.Collection("tasks");

Meteor.methods({
  "tasks.insert"(text) {
    check(text, String);
    if (!this.userId) throw new Meteor.Error("not-authorized");

    Tasks.insert({
      text,
      createdAt: new Date(),
      owner: this.userId,
      username: Meteor.users.findOne(this.userId).username,
    });
  },
  "tasks.remove"(taskId) {
    check(taskId, String);
    if (!this.userId) throw new Meteor.Error("not-authorized");

    const taskToRemove = Tasks.findOne({_id: {$eq: taskId}, owner: {$eq: this.userId}});
    if (taskToRemove) {
      Tasks.remove(taskId);
    } else {
      throw new Meteor.Error("not-found");
    }
  },
  "tasks.setCompleted"(taskId, setCompleted) {
    check(taskId, String);
    check(setCompleted, Boolean);

    Tasks.update(taskId, {$set: {completed: setCompleted}})
  }
});
