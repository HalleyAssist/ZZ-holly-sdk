import got from "got";

export class DevicesAPI {
  constructor(app) {
    this.app = app;
  }

  getAll() {
    return got(`${this.app.api.url}/devices`, {
      method: "GET",
      json: true
    }).then(res => {
      return res.body.devices;
    });
  }

  sendInstruction(deviceId, instruction) {
    return got(`${this.app.api.url}/devices/${deviceId}/instructions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ instruction }),
      json: true
    });
  }
}
