import inquirer from 'inquirer';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface SuperAdminInput {
  email: string;
  password: string;
  name: string;
}

/**
 * Prompts the user for super admin details and creates a super admin.
 */
async function createSuperAdmin() {
  try {
    const answers: SuperAdminInput = await inquirer.prompt([
      {
        type: 'input',
        name: 'email',
        message: 'Enter email address:',
        validate: (input: string) => input.includes('@') ? true : 'Please enter a valid email address.',
      },
      {
        type: 'password',
        name: 'password',
        message: 'Enter password:',
        mask: '*',
        validate: (input: string) => input.length >= 6 ? true : 'Password must be at least 6 characters long.',
      },
      {
        type: 'input',
        name: 'name',
        message: 'Enter name:',
      },
    ]);

    const hashedPassword = await bcrypt.hash(answers.password, 10);

    const superAdmin = await prisma.user.create({
      data: {
        email: answers.email,
        password: hashedPassword,
        name: answers.name,
        role: 'SUPERADMIN',
      },
    });

    console.log('Super Admin created successfully!');
    console.log(superAdmin);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error creating super admin:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createSuperAdmin();
