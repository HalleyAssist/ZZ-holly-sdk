import {App} from "../../lib";

let app = new App(`${__dirname}/manifest.json`, `${__dirname}/public`);

app.routes.get("/info", (req, res) => {
  res.send({
    info: {
      manifest: app.manifest,
      apiUrl: app.api.url
    }
  });
});

app.run();
