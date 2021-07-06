process.env.NODE_ENV = "development";

const request = require("supertest"),
  server = require("../index"),
  chai = require("chai"),
  chaiHttp = require("chai-http");

let should = chai.should();
chai.use(chaiHttp);

describe("Check Uer Login", () => {
  // beforeEach((done) => {
  // });

  /*
   * Test the /POST route
   */
  const random = Math.floor(Math.random() * 1000 + 1);
  const email='user'+random+'@gmail.com'.trim();

  describe("Enroll new User", () => {
    it("it should POST a new user", (done) => {
      chai
        .request(server)
        .post("/api/auth/signup")
        .send({
          email,
          password: "12345678",
          name: "user"+random, 
        })
        .end((err, res) => {
          res.should.have.status(201); 
          done();
        });
    });
  });

  describe("User API", () => {
    it("it should login", (done) => {
      chai
        .request(server)
        .post("/api/auth/login")
        .send({ email, password: "12345678" })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

});
