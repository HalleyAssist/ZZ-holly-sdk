import got from "got";

export class AppInstallationsAPI {
  constructor(app) {
    this.app = app;
  }

  updateAppInstallation(appInstallation) {
    return got(`${this.app.api.url}/app_installations/${this.app.manifest.name}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ app_installation: appInstallation }),
      json: true
    }).then(res => {
      return res.body.app_installation;
    });
  }
}
