import {Meteor} from "meteor/meteor";
import {Mongo} from "meteor/mongo";
import {check} from "meteor/check";

export const Tasks = new Mongo.Collection("tasks");

if (Meteor.isServer) {
  Meteor.publish('tasks', function sth() {
    return Tasks.find({
      $or: [
        {private: {$ne: true}},
        {owner: this.userId}
      ]
    });
  })
}

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

    const foundTask = Tasks.findOne({_id: {$eq: taskId}, owner: {$eq: this.userId}});
    if (foundTask) {
      Tasks.remove(taskId);
    } else {
      throw new Meteor.Error("not-found");
    }
  },
  "tasks.update"(taskId, attribute, value) {
    check(taskId, String);
    check(attribute, String);

    if (!this.userId) throw new Meteor.Error("not-authorized");

    const foundTask = Tasks.findOne({_id: {$eq: taskId}, owner: {$eq: this.userId}});

    if (foundTask) {
      Tasks.update(taskId, {$set: {[attribute]: value}})
    } else {
      throw new Meteor.Error("not-found");
    }

  }
});
