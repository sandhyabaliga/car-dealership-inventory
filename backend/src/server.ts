
import 'dotenv/config';
import { app, prisma } from './app.js';

const port = Number(process.env.PORT) || 3000;

const server = app.listen(port, () => {
  console.log(`Car Dealership API running at http://localhost:${port}`);
});

function shutdown() {
  server.close(() => {
    void prisma.$disconnect().finally(() => process.exit(0));
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
