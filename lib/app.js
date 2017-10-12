import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import { API } from "./api";
import { Keystore } from "./keystore";
import { DeviceManager } from "./device-manager";
import Datastore from 'nedb';

export class App {
  constructor(manifestPath, publicPath) {
    this.manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    this.routes = express()
      .use(express.static(publicPath))
      .use(bodyParser.json());
    this.api = new API(this);

    // this.devices is an array of objects
    // eg. [{reference_device_name: door, device_id: 8}]
    this.devices = null;
    this.deviceManager = null;
    this.keystore = null;
    this.appInstallation = null;
  }

  inform(address) {
    return this.api.appInstallations.updateAppInstallation({
      port: address.port
    });
  }


  db(name){
    if(!this.appInstallation){
      return null;//Not yet initialized!
    }
    return new Datastore({ filename: this.dbPath() + name + ".db", autoload: true });
  }

  run(port = this.getPort(), address = "127.0.0.1") {
    return new Promise(resolve => {
      let server = this.routes.listen(port, address, () => {
        // Inform the Hub API of the server's port number.
        this.inform(server.address())
          .then(appInstallation => {
            
            this.appInstallation = appInstallation;

            this.devices = appInstallation.installation_devices;
            const self = this;
            this.keystore = new Keystore(function(name){
              return self.db(name);
            });

            DeviceManager.create(this)
              .then(deviceManager => {
                this.deviceManager = deviceManager;
              })
              .then(() => {
                resolve();

                console.log("Application Started");
              });
          })
          .catch(err => {
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

  dbPath() {
    // HALLEY_LOCAL_DB takes any argument. Local DB has a fixed location.
    if (process.env.HALLEY_LOCAL_DB) {
      return __dirname + "/../";
    }
    return this.appInstallation.database_dir;
  }
}
