sleep 10;
npx prisma migrate dev --name init;
yarn seed;
yarn test:e2e;
