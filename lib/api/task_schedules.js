import got from "got";

export class TaskSchedulesAPI {
  constructor(app) {
    this.app = app;
  }

  getAll() {
    return got(`${this.app.api.url}/app_installations/${this.app.manifest.name}/task_schedules`, {
      method: "GET",
      json: true
    }).then(res => {
      return res.body.task_schedules;
    });
  }

  createTaskSchedule(taskSchedule) {
    return got(`${this.app.api.url}/app_installations/${this.app.manifest.name}/task_schedules`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: { task_schedule: taskSchedule },
      json: true
    }).then(res => {
      return res.body.task_schedule;
    });
  }

  destroyTaskSchedule(id) {
    return got(`${this.app.api.url}/task_schedules/${id}`, { method: "DELETE" });
  }
}
