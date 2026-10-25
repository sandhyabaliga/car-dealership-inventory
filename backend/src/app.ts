
import express from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

export const app = express();
export const prisma = new PrismaClient();

app.use(express.json());

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== 'string' ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      typeof password !== 'string' ||
      password.length < 8
    ) {
      return res.status(400).json({
        message: 'A valid email and password of at least 8 characters are required',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return res.status(409).json({
        message: 'Email is already registered',
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return res.status(201).json({ user });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      message: 'Unable to register user',
    });
  }
});
