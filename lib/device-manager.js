import got from "got";
import {Device} from "./model/device";

export class DeviceManager {
  constructor(app) {
    this.app     = app;
    this.devices = null;

    this.app.api.devices.getAll(true).then(res => {
      this.devices = res.map(device => new Device(app, device));
    }).catch(err => {
      console.error(err);
    });
  }

  getReferenceDevice(referenceName) {
    return this.getDeviceById(this.app.devices.get(referenceName));
  }

  getDeviceByName(name) {
    return this.devices.find(device => device.name === name);
  }

  getDeviceById(id) {
    return this.devices.find(device => device.id === id);
  }
}
