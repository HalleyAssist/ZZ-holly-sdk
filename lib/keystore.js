const KEYSTORE_NAME = "_keystore";
const Q = require("q");

export class Keystore {
  constructor(db) {
    this.db = db(KEYSTORE_NAME);
    this.db.ensureIndex({ fieldName: 'id', unique: true });
  }

  getAll() {
    const deferred = Q.defer();

    this.db.find({}, function (err, docs) {
      if(err){
        deferred.reject(err);
        return;
      }
      var dict = {};
      for(var i in docs){
        var d = docs[i];
        dict[d.id] = d.value;
      }
      
      deferred.resolve(dict); 
    });

    return deferred.promise;
  }

  get(key) {
    const deferred = Q.defer();

    this.db.find({id: key}, function (err, docs) {
      if(err){
        deferred.reject(err);
        return;
      }
      var dict = {};
      for(var i in docs){
        deferred.resolve(docs[i].value); 
        return;
      }
      
      deferred.resolve(undefined); 
    });

    return deferred.promise;
  }

  set(key,value) {
    const deferred = Q.defer();
    this.db.update({ id: key }, { id: key, value: value }, { upsert: true }, function (err, numReplaced, upsert) {
      if(err){
        deferred.reject(err);
        return;
      }
      deferred.resolve(numReplaced);
    });
    return deferred.promise;
  }

  reset() {
    const deferred = Q.defer();
    this.db.remove({}, { multi: true }, function (err, numRemoved) {
      if(err){
        deferred.reject(err);
        return;
      }
      deferred.resolve(numRemoved);
    });
    return deferred.promise;
  }
}
