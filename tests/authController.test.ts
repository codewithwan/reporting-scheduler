import request from 'supertest';
import app from '../src/app';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { describe, expect, it, beforeAll, afterAll } from '@jest/globals';

const prisma = new PrismaClient();

describe('Auth Controller', () => {
  beforeAll(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'password123',
      });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('User registered successfully');
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user.email).toBe('testuser@example.com');
  });

  it('should not register a user with an existing email', async () => {
    await prisma.user.create({
      data: {
        name: 'Existing User',
        email: 'existinguser@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'engineer',
      },
    });

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'New User',
        email: 'existinguser@example.com',
        password: 'password123',
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Email already in use');
  });

  it('should login an existing user', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'Login User',
        email: 'loginuser@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'engineer',
      },
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'loginuser@example.com',
        password: 'password123',
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Login successful');
    expect(res.body).toHaveProperty('token');
  });

  it('should not login with incorrect password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'loginuser@example.com',
        password: 'wrongpassword',
      });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Invalid email or password');
  });

  it('should not login with non-existent email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'password123',
      });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Invalid email or password');
  });

  it('should not register a user with weak password', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Weak Password User',
        email: 'weakpassword@example.com',
        password: '123',
      });

    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ msg: 'Invalid value' }),
      ])
    );
  });

  it('should not register a user with invalid email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Invalid Email User',
        email: 'invalid-email',
        password: 'password123',
      });

    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ msg: 'Invalid value' }),
      ])
    );
  });
});