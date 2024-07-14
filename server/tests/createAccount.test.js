const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { app } = require("../src/server"); // Adjust the path accordingly
const http = require("http");

describe("Create Account API", () => {
  let mongoServer;
  let server;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    server = http.createServer(app);
    server.listen(3000); // Listen on a specific port for testing
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
    server.close(); // Close the server after tests
  });

  afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany();
    }
  });

  it("should create a new account", async () => {
    const newUser = {
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@example.com",
      password: "password123",
      address: "123 Main St",
      creditCard: "1234-5678-9012-3456",
    };

    const response = await request(server)
      .post("/api/users/create")
      .send(newUser);

    expect(response.status).toBe(201);
    expect(response.text).toBe("Account created successfully");
  });

  it("should get all scooter info", async() => {
    const res = await request(server).get('/api/scooters');

    expect(res.status).toBe(200);
  })
});
