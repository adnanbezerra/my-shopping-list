import supertest from "supertest";
import app from "../src/app";
import { getNewRandomItem } from "./factory/ItemFactory";
import { prisma } from "../src/database";

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE items`
})

afterAll(async () => {
  await prisma.$disconnect()
})

describe('Testa POST /items ', () => {
  it('Deve retornar 201, se cadastrado um item no formato correto', async () => {
    const body = getNewRandomItem();

    const result = await supertest(app).post("/items").send(body);
    expect(result.status).toBe(201);
  });

  it('Deve retornar 409, ao tentar cadastrar um item que exista', async () => {
    const body = getNewRandomItem();

    await supertest(app).post("/items").send(body);
    const result = await supertest(app).post("/items").send(body);
    expect(result.status).toBe(409);
  });
});

describe('Testa GET /items ', () => {
  it('Deve retornar status 200 e o body no formato de Array', async () => {
    const result = await supertest(app).get("/items");

    expect(result.status).toBe(200);
    expect(result.body).toBeInstanceOf(Array);
  });
});

describe('Testa GET /items/:id ', () => {
  it('Deve retornar status 200 e um objeto igual a o item cadastrado', async () => {
    const body = getNewRandomItem();
    await supertest(app).post("/items").send(body);

    const itens = await supertest(app).get("/items");
    const id = itens.body[0].id;

    const result = await supertest(app).get(`/items/${id}`);

    expect(result.status).toBe(200);
    expect(result.body).toMatchObject(body);
  });

  it('Deve retornar status 404 caso não exista um item com esse id', async () => {
    const result = await supertest(app).get("/items/1");
    expect(result.status).toBe(404);
  });
});
