import {AppInstallationsAPI} from "./app_installations";
import {DevicesAPI} from "./devices";
import {TaskSchedulesAPI} from "./task_schedules";
import {EventsAPI} from "./events";

export class API {
  constructor(app) {
    this.url = process.argv.slice(2)[0];
    this.appInstallations = new AppInstallationsAPI(app);
    this.devices = new DevicesAPI(app);
    this.taskSchedules = new TaskSchedulesAPI(app);
    this.events = new EventsAPI(app);
  }
}
