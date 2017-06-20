import should from "should";
import execa from "execa";
import express from "express";
import bodyParser from "body-parser";
import tempfile from "tempfile";
import got from "got";
import path from "path";
import manifest from "./app/manifest";

let hub = null;
let appInstallation = null;
let portNumberReceived = null;

describe("holly-sdk", function() {
  this.timeout(10000); // Since many unit tests are async, increase the timeout.

  describe("apps", () => {
    before(done => {
      let api = express();

      api.use(bodyParser.json());

      portNumberReceived = new Promise(resolve => {
        api.put(`/app_installations/${manifest.name}`, (req, res) => {
          appInstallation = req.body.app_installation;
          Object.assign(appInstallation, { database_path: tempfile(), installation_devices: [] });
          res.send({ app_installation: appInstallation });
          resolve();
        });
      });

      hub = api.listen(0, done);

    });

    it("should launch as a child process successfully", done => {
      // If the child process survives for 1.5 seconds without error, consider it's launch successful.
      let timer = setTimeout(() => {
        timer = null;
        done();
      }, 1500);

      execa(path.join(path.dirname(__dirname), "node_modules", ".bin", "babel-node"), [
        path.join(__dirname, "app", "main.js"),
        `http://localhost:${hub.address().port}`
      ]).then(cp => {
        // Never gets reached
        cp.disconnect();
      }).catch(err => {
        if (timer) {
          clearTimeout(timer);
          done(err);

        }
      });
    });

    it("should send their port number to the Hub API", done => {
      portNumberReceived.then(() => {
        appInstallation.should.be.an.Object().and.have.property("port");
      }).then(done).catch(done);
    });

    it("should expose HTTP endpoints", done => {
      got(`http://localhost:${appInstallation.port}/info`, {
        method: "GET",
        json: true
      }).then(res => {
        let {info} = res.body;
        info.should.be.an.Object();
        info.should.have.property("manifest", manifest);
        info.should.have.property("apiUrl", `http://localhost:${hub.address().port}`);
      }).then(done).catch(done);
    });

    it("should serve static files from the root HTTP endpoint", done => {
      got(`http://localhost:${appInstallation.port}/`, {
        method: "GET"
      }).then(res => {
        res.statusCode.should.be.a.Number().and.exactly(200);
      }).then(done).catch(done);
    });
  });
});
