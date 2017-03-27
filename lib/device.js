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

  sendInstruction(commands) {
    return got(`${this.app.api.url}/devices/${this.id}/instructions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commands }),
      json: true
    });
  }

  hasCapability(capability) {
    return this.capabilities.some(c => c === capability);
  }
}
