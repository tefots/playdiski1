// src/lib/prisma.ts
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();
// export { prisma };

// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient().$extends(withAccelerate());

export { prisma };