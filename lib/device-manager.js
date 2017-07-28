import got from "got";
import { Device } from "./model/device";

export class DeviceManager {
  constructor(app, devices) {
    this.app = app;
    this.devices = devices;
  }

  // Initialiser for DeviceManager
  static create(app) {
    return app.api.devices
      .getAll(true)
      .then(res => {
        return res.map(device => new Device(app, device));
      })
      .then(devices => {
        return new DeviceManager(app, devices);
      });
  }

  // Gets all devices that are liked by reference name
  getLinkedDevicesByReferenceName(referenceName) {
    let linkedDevices = this.app.devices.filter((device) => {
      return device.reference_device_name === referenceName;
    });
    return linkedDevices.map((device) => {
      return this.getDeviceById(device.device_id);
    });
  }

  // Gets a single device that fits the specified name
  getDeviceByName(name) {
    return this.devices.find(device => device.name === name);
  }

  // Gets a single device that fits the specified id
  getDeviceById(id) {
    return this.devices.find(device => device.id === id);
  }

  // Returns all devices that linked by capabilites
  // Takes an array of capabilities
  getLinkedDevicesByCapabilities(capabilities) {
    let devices = this.devices.filter(device => {
      return compare(capabilities, device.capabilities);
    });

    let foundDevices = [];
    devices.forEach((device) => {
      this.app.devices.forEach((dev) => {
        if(dev.device_id === device.id) {
          foundDevices.push(device);
        }
      });
    });
    return foundDevices;
  }
}

// Compare two arrays
const compare = (findables, object) => {
  // Get all values in object
  let values = [];

  for (let i in object) {
    values.push(object[i]);
  }

  // For each findable
  for (let i = 0; i < findables.length; i++) {
    // Is it in the values?
    if (values.indexOf(findables[i]) == -1) {
      return false;
    }
  }

  return true;
};
