import Datastore from 'nedb';
import { Keystore } from '../lib/keystore'
import should from "should";

const os = require("os");
const sleep = require('system-sleep');

describe("holly-sdk", function () {
    this.timeout(1000); // Since many unit tests are async, increase the timeout.

    describe("keystore", () => {
        var path = os.tmpdir();
        console.log("Using %s as temporary storage", path)

        const dbPath = function (name) {
            return path + "/" + name + ".db";
        }

        const db = function (name) {
            return new Datastore({ filename: dbPath(name), autoload: true });
        };

        it("should create a db file", done => {
            db("test");
            sleep(100)
            done()
        });

        var keystore = new Keystore(db)

        it("an inserted value should be visible to get", done => {
            keystore.set("a", "b").then(function () {
                return keystore.get("a").then(function (value) {
                    should.exist(value);
                    value.should.equal("b");
                    done();
                })
            }).done();
        });


        it("an inserted value should be updatable", done => {
            keystore.set("a", "b").then(function () {
                keystore.set("a", "c").then(function () {
                    return keystore.get("a").then(function (value) {
                        should.exist(value);
                        value.should.equal("c");
                        done();
                    })
                });
            }).done();
        });

        it("reset should clear the keystore", done => {
            keystore.reset().then(function () {
                return keystore.getAll().then(function (result) {
                    result.should.be.empty
                    done();
                });
            }).done();
        });
        
        it("getAll should return all results", done => {
            keystore.set("a", "b").then(function () {
                return keystore.set("b", "c").then(function () {
                    return keystore.getAll().then(function (value) {
                        should.exist(value);
                        value.should.deepEqual({a:"b",b:"c"});
                        done();
                    })
                });
            }).done();
        });
    });

});

