
import request from 'supertest';
import { app, prisma } from '../src/app';

beforeEach(async () => {
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('POST /api/auth/register', () => {
  it('registers a user without exposing their password', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'firstuser@example.com',
        password: 'StrongPass123!',
      });

    expect(response.status).toBe(201);
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user.email).toBe('firstuser@example.com');
    expect(response.body.user).not.toHaveProperty('password');
    expect(response.body.user).not.toHaveProperty('passwordHash');

    const savedUser = await prisma.user.findUnique({
      where: { email: 'firstuser@example.com' },
    });

    expect(savedUser).not.toBeNull();
    expect(savedUser!.passwordHash).not.toBe('StrongPass123!');
  });

  it('rejects duplicate email addresses', async () => {
    const user = {
      email: 'duplicate@example.com',
      password: 'StrongPass123!',
    };

    await request(app).post('/api/auth/register').send(user);

    const response = await request(app)
      .post('/api/auth/register')
      .send(user);

    expect(response.status).toBe(409);
  });

  it('rejects invalid email and short passwords', async () => {
    const badEmail = await request(app)
      .post('/api/auth/register')
      .send({ email: 'not-an-email', password: 'StrongPass123!' });

    const shortPassword = await request(app)
      .post('/api/auth/register')
      .send({ email: 'valid@example.com', password: '123' });

    expect(badEmail.status).toBe(400);
    expect(shortPassword.status).toBe(400);
  });
});
