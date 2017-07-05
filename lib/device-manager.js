import got from "got";
import {Device} from "./model/device";

export class DeviceManager {
  constructor(app, devices) {
    this.app     = app;
    this.devices = devices;
  }
  
  static create(app){
    return app.api.devices.getAll(true).then(res => {
      return res.map(device => new Device(app, device));
    }).then(devices => {
		return new DeviceManager(app, devices);
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
