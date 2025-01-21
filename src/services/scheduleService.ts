import { PrismaClient } from "@prisma/client";
import { Schedule } from "@prisma/client";

const prisma = new PrismaClient();

interface CreateScheduleInput {
  taskName: string;
  executeAt: Date;
  engineerId: string;
  adminId: string;
}

export const createSchedule = async (data: CreateScheduleInput): Promise<Schedule> => {
  return prisma.schedule.create({
    data,
  });
};

export const getSchedulesByUser = async (userId: string): Promise<Schedule[]> => {
  return prisma.schedule.findMany({
    where: {
      OR: [
        { engineerId: userId },
        { adminId: userId },
      ],
    },
  });
};

export const updateScheduleById = async (id: string, data: Partial<Schedule>): Promise<Schedule> => {
  return prisma.schedule.update({
    where: { id },
    data,
  });
};

export const deleteScheduleById = async (id: string): Promise<void> => {
  await prisma.schedule.delete({
    where: { id },
  });
};
