const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");
chai.use(chaiHttp);
chai.should();

describe("API Smoke Tests", () => {
  it("GET /api/items should return items", (done) => {
    chai.request(server)
      .get("/api/items")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("array");
        done();
      });
  });

  it("GET /api/fines should return fines", (done) => {
    chai.request(server)
      .get("/api/fines")
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});
