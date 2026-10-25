
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { app, prisma } from '../src/app';

const testSecret = 'test-secret-for-vehicle-tests';

let userToken: string;

beforeAll(() => {
  process.env.JWT_SECRET = testSecret;
});

beforeEach(async () => {
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();

  const user = await prisma.user.create({
    data: {
      email: 'vehicleuser@example.com',
      passwordHash: 'not-used-in-this-test',
      role: 'USER',
    },
  });

  userToken = jwt.sign(
    { userId: user.id, role: user.role },
    testSecret,
    { expiresIn: '1h' },
  );
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('GET /api/vehicles', () => {
  it('returns the vehicle inventory for an authenticated user', async () => {
    await prisma.vehicle.create({
      data: {
        make: 'Toyota',
        model: 'Corolla',
        category: 'Sedan',
        price: 15000,
        quantity: 3,
      },
    });

    const response = await request(app)
      .get('/api/vehicles')
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body.vehicles).toHaveLength(1);
    expect(response.body.vehicles[0].make).toBe('Toyota');
  });

  it('rejects requests without a valid token', async () => {
    const response = await request(app).get('/api/vehicles');

    expect(response.status).toBe(401);
  });

  it('filters vehicles by make', async () => {
    await prisma.vehicle.createMany({
      data: [
        {
          make: 'Toyota',
          model: 'Corolla',
          category: 'Sedan',
          price: 15000,
          quantity: 3,
        },
        {
          make: 'Honda',
          model: 'Civic',
          category: 'Sedan',
          price: 17000,
          quantity: 2,
        },
      ],
    });

    const response = await request(app)
      .get('/api/vehicles?make=Toyota')
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body.vehicles).toHaveLength(1);
    expect(response.body.vehicles[0].make).toBe('Toyota');
  });
});

describe('POST /api/vehicles', () => {
  it('rejects vehicle creation by a regular user', async () => {
    const response = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        make: 'Toyota',
        model: 'Corolla',
        category: 'Sedan',
        price: 15000,
        quantity: 3,
      });

    expect(response.status).toBe(403);
  });
});

describe('POST /api/vehicles/:id/purchase', () => {
  it('rejects purchasing when the user is not authenticated', async () => {
    const vehicle = await prisma.vehicle.create({
      data: {
        make: 'Toyota',
        model: 'Corolla',
        category: 'Sedan',
        price: 15000,
        quantity: 2,
      },
    });

    const response = await request(app)
      .post(`/api/vehicles/${vehicle.id}/purchase`);

    expect(response.status).toBe(401);
  });

  it('rejects purchasing a vehicle that is out of stock', async () => {
    const vehicle = await prisma.vehicle.create({
      data: {
        make: 'Honda',
        model: 'Civic',
        category: 'Sedan',
        price: 17000,
        quantity: 0,
      },
    });

    const response = await request(app)
      .post(`/api/vehicles/${vehicle.id}/purchase`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(409);
  });
});

describe('POST /api/vehicles/:id/restock', () => {
  it('rejects restocking by a regular user', async () => {
    const vehicle = await prisma.vehicle.create({
      data: {
        make: 'Toyota',
        model: 'Corolla',
        category: 'Sedan',
        price: 15000,
        quantity: 1,
      },
    });

    const response = await request(app)
      .post(`/api/vehicles/${vehicle.id}/restock`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ quantity: 5 });

    expect(response.status).toBe(403);
  });
});

describe('DELETE /api/vehicles/:id', () => {
  it('rejects vehicle deletion by a regular user', async () => {
    const vehicle = await prisma.vehicle.create({
      data: {
        make: 'Hyundai',
        model: 'Creta',
        category: 'SUV',
        price: 18000,
        quantity: 3,
      },
    });

    const response = await request(app)
      .delete(`/api/vehicles/${vehicle.id}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(403);
  });
});



