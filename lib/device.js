import got from "got";

export class Device {
  constructor(app, device) {
    this.app  = app;
    this.id   = device.id;
    this.name = device.name;
    this.type = device.type;
    this.capabilities = device.capabilities;
    this.platformInformation = device.platform_information;
  }

  sendInstruction(instruction) {
    return this.app.api.devices.instruct(this.id, instruction);
  }

  hasCapability(capability) {
    return this.capabilities.some(c => c === capability);
  }
}
