import express from "express";
import bodyParser from "body-parser";
import low from "lowdb";
import storage from "lowdb/file-async";
import fs from "fs";
import {API} from "./api";
import {Keystore} from "./keystore";
import {DeviceManager} from "./device-manager";

export class App {
  constructor(manifestPath, publicPath) {
    this.manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    this.routes = express().use(express.static(publicPath)).use(bodyParser.json());
    this.api = new API(this);
    this.devices = null;
    this.deviceManager = null;
    this.db = null;
    this.keystore = null;
  }
  
  inform(address) {
	  return this.api.appInstallations.updateAppInstallation({ port: address.port });
  }

  
  run(port = this.getPort(), address = "127.0.0.1") {
    return new Promise(resolve => {
      let server = this.routes.listen(port, address, () => {
        // Inform the Hub API of the server's port number.
        this.inform(server.address())
        .then(appInstallation => {
          this.devices = appInstallation.installation_devices.reduce((map, installationDevice) => {
            return map.set(installationDevice.reference_device_name, installationDevice.device_id);
          }, new Map());

          this.db = low(this.dbPath(appInstallation), { storage });

          this.keystore = new Keystore(this.db);

          DeviceManager.create(this).then(deviceManager=>{
			  this.deviceManager = deviceManager;
		  }).then(()=>{
			  resolve();
			  
			  console.log("Application Started");
		  });
        }).catch(err => {
          console.error(err);
          process.exit(1);
        });
      });
    });
  }

  getPort() {
    if (process.env.HALLEY_PORT) {
      return process.env.HALLEY_PORT;
    }
    return 0;
  }

  dbPath(appInstallation) {
    // HALLEY_LOCAL_DB takes any argument. Local DB has a fixed location.
    if (process.env.HALLEY_LOCAL_DB) {
      return __dirname + '/../local-holly-db.json';
    }
    return appInstallation.database_path;
  }

}
