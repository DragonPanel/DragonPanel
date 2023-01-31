import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createApp } from 'src/create-app';
import { expect } from '@jest/globals';

describe("Authentication", () => {
  let app: INestApplication;
  const validUsername = "Zdzichu5";
  const validUsername2 = "Zdzichu6";
  const validPassword = "StrongS€curePa$$word"

  beforeAll(async () => {
    app = await createApp();
    await app.init();
  });


  describe("Init", () => {
    it("GET /api/auth/init - should return initialized state false", () => {
      return request(app.getHttpServer())
        .get("/api/auth/init")
        .expect(200)
        .expect("Content-Type", /application\/json/)
        .expect({
          initialized: false
        });
    });
  
    it("POST /api/auth/init - no data should return 400", async () => {
      return request(app.getHttpServer())
        .post("/api/auth/init")
        .expect(400);
    });

    it("POST /api/auth/init - wrong data should return 400", async () => {
      return request(app.getHttpServer())
        .post("/api/auth/init")
        .send({ login: "XD12345677899", password: "xoxaxoxaxoxa" })
        .expect(400);
    });

    it("POST /api/auth/init - username shorter than 3 characters should return 400", async () => {
      return request(app.getHttpServer())
        .post("/api/auth/init")
        .send({ username: "x", password: validPassword })
        .expect(400);
    });

    it("POST /api/auth/init - username longer then 16 characters should return 400", async () => {
      return request(app.getHttpServer())
        .post("/api/auth/init")
        .send({ username: "x".repeat(17), password: validPassword })
        .expect(400);
    });

    it("POST /api/auth/init - username containing other characters than alfanumerics, space and underscore should return 400", () => {
      return request(app.getHttpServer())
        .post("/api/auth/init")
        .send({ username: "!Edek15", password: validPassword })
        .expect(400);
    });

    it("POST /api/auth/init - password shorter than 8 characters should return 400", async () => {
      return request(app.getHttpServer())
        .post("/api/auth/init")
        .send({ username: validUsername, password: "xoxo" })
        .expect(400);
    });

    it("POST /api/auth/init - password longer than 72 characters should return 400", async () => {
      return request(app.getHttpServer())
        .post("/api/auth/init")
        .send({ username: validUsername, password: "pa$$word".repeat(9) + "x" })
        .expect(400);
    });

    it("POST /api/auth/init - with valid data should create user and return it's username lowercased with code 201", async () => {
      return request(app.getHttpServer())
        .post("/api/auth/init")
        .send({ username: validUsername, password: validPassword })
        .expect(201)
        .expect(res => expect(res.body).toMatchObject({ username: validUsername.toLowerCase() }))
    });

    it("POST /api/auth/init - another valid post request to init should result in 403 and error in response 'AdminAlreadyExistException'", async () => {
      return request(app.getHttpServer())
        .post("/api/auth/init")
        .send({ username: validUsername2, password: validPassword })
        .expect(403)
        .expect(res => expect(res.body).toMatchObject({ error: "AdminAlreadyExistException" }));
    });
  });

  describe("Login, Me and Logout", () => {
    let accessToken: string;

    it("GET /api/auth/me - without auth token should return 401", async () => {
      return request(app.getHttpServer())
        .get("/api/auth/me")
        .expect(401)
    });

    it("GET /api/auth/me - with empty token should return 401", async () => {
      await request(app.getHttpServer())
        .get("/api/auth/me")
        .set("Authorization", `Bearer `)
        .expect(401);

      await request(app.getHttpServer())
        .get("/api/auth/me")
        .set("Authorization", `Bearer`)
        .expect(401);

      await request(app.getHttpServer())
        .get("/api/auth/me")
        .set("Authorization", ``)
        .expect(401);
    });

    it("GET /api/auth/me - with invalid token should return 401", async () => {
      return request(app.getHttpServer())
        .get("/api/auth/me")
        .set("Authorization", `Bearer invalidTokenxD`)
        .expect(401);
    });

    it("POST /api/auth/login - with invalid data format should return 401 - yeah 401, passport... I'll try to change that", async () => {
      await request(app.getHttpServer())
        .post("/api/auth/login")
        .expect(401);

      await request(app.getHttpServer())
        .post("/api/auth/login")
        .send({ username: validUsername })
        .expect(401);
    });

    it("POST /api/auth/login - with valid data format but invalid credentials should return 401 with InvalidCredentialsException error", async () => {
      await request(app.getHttpServer())
        .post("/api/auth/login")
        .send({ username: validUsername, password: "InvalidLol" })
        .expect(401)
        .expect(res => expect(res.body).toMatchObject({ error: "InvalidCredentialsException" }))
    });

    it("POST /api/auth/login - shouldn't be able to login to second user tried to being register by second init", async () => {
      await request(app.getHttpServer())
        .post("/api/auth/login")
        .send({ username: validUsername2, password: validPassword })
        .expect(401)
        .expect(res => expect(res.body).toMatchObject({ error: "InvalidCredentialsException" }));
    });

    it("POST /api/auth/login - should login into first user created with init and should contain valid token", async () => {
      await request(app.getHttpServer())
        .post("/api/auth/login")
        .send({ username: validUsername, password: validPassword })
        .expect(200)
        .expect(res => {
          expect(res.body.token).toBeTruthy();
          accessToken = res.body.token;
        });
    });

    it("GET /api/auth/me - should return valid user after login", async () => {
      await request(app.getHttpServer())
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200)
        .expect(res => expect(res.body).toMatchObject({ username: validUsername.toLowerCase() }));
    });

    it("GET /api/auth/me - should not return password in user object", async () => {
      await request(app.getHttpServer())
      .get("/api/auth/me")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200)
        // @ts-ignore
        .expect(res => expect(res.body.password).toBeNil());
    });

    it("GET /api/auth/me - should not return superadmin in user object", async () => {
      await request(app.getHttpServer())
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200)
        // @ts-ignore
        .expect(res => expect(res.body.superadmin).toBeNil());
    });

    it("POST /api/auth/logout - should logout user and return 204", async () => {
      await request(app.getHttpServer())
        .post("/api/auth/logout")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(204);
    })

    it("GET /api/auth/me - should return 401 after logout", async () => {
      await request(app.getHttpServer())
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(401);
    })
  });

  afterAll(async () => {
    await app.close();
  })
})
