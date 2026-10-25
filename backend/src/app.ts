import cors from 'cors';
import jwt from 'jsonwebtoken';
import express from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

export const app = express();
export const prisma = new PrismaClient();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));

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

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({
        message: 'Email and password are required',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return res.status(500).json({
        message: 'JWT secret is not configured',
      });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      secret,
      { expiresIn: '1h' },
    );

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      message: 'Unable to log in',
    });
  }
});

const authenticateToken: express.RequestHandler = (req, res, next) => {
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith('Bearer ')
    ? authorization.slice(7)
    : null;

  const secret = process.env.JWT_SECRET;

  if (!token || !secret) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }

  try {
    const payload = jwt.verify(token, secret);
    res.locals.auth = payload;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

app.get('/api/vehicles', authenticateToken, async (req, res) => {
  try {
    const make =
      typeof req.query.make === 'string' ? req.query.make : undefined;

    const model =
      typeof req.query.model === 'string' ? req.query.model : undefined;

    const category =
      typeof req.query.category === 'string'
        ? req.query.category
        : undefined;

    const vehicles = await prisma.vehicle.findMany({
      where: {
        ...(make ? { make: { contains: make } } : {}),
        ...(model ? { model: { contains: model } } : {}),
        ...(category ? { category: { contains: category } } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ vehicles });
  } catch (error) {
    console.error('Vehicle listing error:', error);
    res.status(500).json({ message: 'Unable to retrieve vehicles' });
  }
});

const requireAdmin: express.RequestHandler = (_req, res, next) => {
  const auth = res.locals.auth as { role?: string } | undefined;

  if (auth?.role !== 'ADMIN') {
    res.status(403).json({ message: 'Admin access required' });
    return;
  }

  next();
};

app.post(
  '/api/vehicles',
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { make, model, category, price, quantity } = req.body;

      if (
        typeof make !== 'string' || !make.trim() ||
        typeof model !== 'string' || !model.trim() ||
        typeof category !== 'string' || !category.trim() ||
        typeof price !== 'number' || !Number.isFinite(price) || price <= 0 ||
        !Number.isInteger(quantity) || quantity < 0
      ) {
        res.status(400).json({
          message: 'Valid make, model, category, positive price, and non-negative integer quantity are required',
        });
        return;
      }

      const vehicle = await prisma.vehicle.create({
        data: {
          make: make.trim(),
          model: model.trim(),
          category: category.trim(),
          price,
          quantity,
        },
      });

      res.status(201).json({ vehicle });
    } catch (error) {
      console.error('Vehicle creation error:', error);
      res.status(500).json({ message: 'Unable to create vehicle' });
    }
  },
);

app.post(
  '/api/vehicles/:id/purchase',
  authenticateToken,
  async (req, res) => {
    try {
      const id = String(req.params.id);

      const vehicle = await prisma.vehicle.findUnique({
        where: { id },
      });

      if (!vehicle) {
        res.status(404).json({ message: 'Vehicle not found' });
        return;
      }

      const result = await prisma.vehicle.updateMany({
        where: {
          id,
          quantity: { gt: 0 },
        },
        data: {
          quantity: { decrement: 1 },
        },
      });

      if (result.count === 0) {
        res.status(409).json({ message: 'Vehicle is out of stock' });
        return;
      }

      const updatedVehicle = await prisma.vehicle.findUnique({
        where: { id },
      });

      res.status(200).json({
        message: 'Vehicle purchased successfully',
        vehicle: updatedVehicle,
      });
    } catch (error) {
      console.error('Vehicle purchase error:', error);
      res.status(500).json({ message: 'Unable to purchase vehicle' });
    }
  },
);

app.post(
  '/api/vehicles/:id/restock',
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const id = String(req.params.id);
      const { quantity } = req.body;

      if (!Number.isInteger(quantity) || quantity <= 0) {
        res.status(400).json({
          message: 'Quantity must be a positive integer',
        });
        return;
      }

      const existing = await prisma.vehicle.findUnique({
        where: { id },
      });

      if (!existing) {
        res.status(404).json({ message: 'Vehicle not found' });
        return;
      }

      const vehicle = await prisma.vehicle.update({
        where: { id },
        data: {
          quantity: { increment: quantity },
        },
      });

      res.status(200).json({
        message: 'Vehicle restocked successfully',
        vehicle,
      });
    } catch (error) {
      console.error('Vehicle restock error:', error);
      res.status(500).json({ message: 'Unable to restock vehicle' });
    }
  },
);

app.delete(
  '/api/vehicles/:id',
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const id = String(req.params.id);

      const vehicle = await prisma.vehicle.findUnique({
        where: { id },
      });

      if (!vehicle) {
        res.status(404).json({ message: 'Vehicle not found' });
        return;
      }

      await prisma.vehicle.delete({
        where: { id },
      });

      res.status(200).json({
        message: 'Vehicle deleted successfully',
      });
    } catch (error) {
      console.error('Vehicle deletion error:', error);
      res.status(500).json({
        message: 'Unable to delete vehicle',
      });
    }
  },
);





