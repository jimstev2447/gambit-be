import server from "../src/server";
import io from "socket.io-client";
import { expect } from "chai";
import { doesNotReject } from "assert";

describe("server", () => {
  let client;
  beforeEach((done) => {
    client = io("http://localhost:9090");
    server.listen(9090);
    done();
  });
  afterEach((done) => {
    client.disconnect();
    server.close(done);
  });

  it("can be connected to by client", (done) => {
    client.on("connect", () => {
      expect(client.connected).to.equal(true);
      done();
    });
  });
  it("on player-join emits the usernames of connected clients to 'new-player'", (done) => {
    client.on("connect", () => {
      client.emit("user-join", { username: "Jim" });
      client.on("new-player", (data) => {
        expect(data.users).to.be.a("Array");
        expect(data.users).to.have.lengthOf(1);
        const client2 = io("http://localhost:9090");
        client2.on("connect", () => {
          client2.emit("user-join", { username: "Tony" });
          client2.on("new-player", (data) => {
            expect(data.users).to.have.lengthOf(2);
            expect(data.users).to.eql(["Jim", "Tony"]);
            client2.disconnect();
            done();
          });
        });
      });
    });
  });
  it("emits a 'log' when users join", () => {
    client.on("connect", (done) => {
      client.emit("user-join", { username: "Jim" });
      client.on("log", (data) => {
        expect(data.message).to.equal("Jim joined");
        done();
      });
    });
  });
});
