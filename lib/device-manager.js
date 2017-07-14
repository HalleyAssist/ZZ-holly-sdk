import got from "got";
import { Device } from "./model/device";

export class DeviceManager {
  constructor(app, devices) {
    this.app = app;
    this.devices = devices;
  }

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

  getReferenceDevices(referenceName) {
    let devices = [];
    this.app.devices.forEach((device) => {
      devices.push(this.getDeviceById(device.device_id));
    });
    return devices;
  }

  getDeviceByName(name) {
    return this.devices.find(device => device.name === name);
  }

  getDeviceById(id) {
    return this.devices.find(device => device.id === id);
  }

  // Returns an array of devices that match the passed capabilities array and that are assinged to this application
  getLinkedDevicesByCapabilities(capabilities) {
    let devices = this.devices.filter(device => {
      return compare(capabilities, device.capabilities);
    });

    let foundDevices = [];

console.log(`>>>>>>>> DEVICES`);
console.log(devices);
console.log(`<<<<<<<< DEVICES`);

    devices.forEach((device) => {
      console.log(`>>>>>> device ${device.id}`)
      console.log("'''''''' this.");
      console.log(this.app.devices);
      this.app.devices.forEach((dev) => {
        console.log(`>>> device: ${device}`);
        if(dev.device_id === device.id) {
          console.log(`>------- Pushing device: ${device.id}`);
          foundDevices.push(device);
        }
      });
    });

    // const dev = devices.filter(device => {
    //   this.app.devices.forEach((value, key, map) => {
    //     if(value === device.id) {
    //       return true;
    //     }

    //   });
    // });

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
