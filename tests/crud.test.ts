import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { describe, expect, it, beforeEach, afterEach } from '@jest/globals';

const prisma = new PrismaClient();

/**
 * Test suite for CRUD operations.
 */
describe('CRUD operations', () => {
  let userId: string;

  /**
   * Hook to run before each test. Creates a new user.
   */
  beforeEach(async () => {
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'admin',
        timezone: 'UTC'
      }
    });

    userId = user.id;
  });

  /**
   * Hook to run after each test. Deletes all users.
   */
  afterEach(async () => {
    await prisma.user.deleteMany(); 
  });

  /**
   * Test case to create a new user and verify its properties.
   */
  it('should create a new user and verify its properties', async () => {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    expect(user).not.toBeNull();
    expect(user?.id).toBe(userId);
    expect(user?.name).toBe('John Doe');
    expect(user?.email).toBe('john.doe@example.com');
    expect(user?.role).toBe('admin');
    expect(user?.timezone).toBe('UTC');
  });

  /**
   * Test case to read a user by ID and verify its properties.
   */
  it('should read a user by ID and verify its properties', async () => {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    expect(user).not.toBeNull();
    expect(user?.id).toBe(userId);
    expect(user?.name).toBe('John Doe');
    expect(user?.email).toBe('john.doe@example.com');
    expect(user?.role).toBe('admin');
    expect(user?.timezone).toBe('UTC');
  });

  /**
   * Test case to update a user's name and verify the change.
   */
  it("should update a user's name and verify the change", async () => {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name: 'Jane Doe' }
    });

    expect(updatedUser).toHaveProperty('id');
    expect(updatedUser.name).toBe('Jane Doe');
    expect(updatedUser.email).toBe('john.doe@example.com');
    expect(updatedUser.role).toBe('admin');
    expect(updatedUser.timezone).toBe('UTC');
  });

  /**
   * Test case to delete a user and verify it no longer exists.
   */
  it('should delete a user and verify it no longer exists', async () => {
    const deletedUser = await prisma.user.delete({
      where: { id: userId }
    });

    expect(deletedUser).toHaveProperty('id');
    expect(deletedUser.id).toBe(userId);

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    expect(user).toBeNull();
  });
});


