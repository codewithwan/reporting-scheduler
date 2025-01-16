import inquirer from 'inquirer';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface SuperAdminInput {
  email: string;
  password: string;
  name: string;
}

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
        role: 'superadmin',
      },
    });

    console.log('Super Admin created successfully!');
    console.log(superAdmin);
  } catch (error) {
    console.error('Error creating super admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSuperAdmin();
