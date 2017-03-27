const KEYSTORE_NAME = "__holly_keystore";

export class Keystore {
  constructor(db) {
    this.db = db;
  }

  getAll() {
    return this.db(KEYSTORE_NAME).size() > 0 ? this.db(KEYSTORE_NAME).first() : {};
  }

  get(key) {
    let keystore = this.getAll();
    return keystore[key];
  }

  set(obj) {
    let keystore = this.getAll();
    Object.assign(keystore, obj);
    this.db(KEYSTORE_NAME).splice(0, this.db(KEYSTORE_NAME).size(), keystore);
  }

  reset() {
    this.db(KEYSTORE_NAME).remove();
  }
}
