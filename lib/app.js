import express from "express";
import bodyParser from "body-parser";
import low from "lowdb";
import storage from "lowdb/file-sync";
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

  run() {
    return new Promise(resolve => {
      let server = this.routes.listen(0, () => {
        // Inform the Hub API of the server's port number.
        this.api.appInstallations.updateAppInstallation({ port: server.address().port })
        .then(appInstallation => {
          this.devices = appInstallation.installation_devices.reduce((map, installationDevice) => {
            return map.set(installationDevice.reference_device_name, installationDevice.device_id);
          }, new Map());

          this.deviceManager = new DeviceManager(this);

          this.db = low(appInstallation.database_path, { storage });

          this.keystore = new Keystore(this.db);

          resolve();
		  
		  console.log("Application Started");
        }).catch(err => {
          console.error(err);
          process.exit(1);
        });
      });
    });
  }
}
