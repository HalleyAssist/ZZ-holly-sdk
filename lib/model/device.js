import got from "got";
import event from "./event";

export class Device {
  constructor(app, device) {
    this.app  = app;
    this.id   = device.id;
    this.name = device.name;
    this.type = device.type;
    this.capabilities = device.capabilities;
    this.platformInformation = device.platform_information;
	if(device.latest_event){
		this.latestEvent = new event(app, device.latest_event);
	}else{
		this.latestEvent = null;
	}
  }

  sendInstruction(instruction) {
    return this.app.api.devices.instruct(this.id, instruction);
  }

  hasCapability(capability) {
    return this.capabilities.some(c => c === capability);
  }
}
