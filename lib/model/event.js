import got from "got";

export class Event {
  constructor(app, event) {
    this.app  = app;
    this.id   = event.id;
    this.action = event.action;
  }
}
