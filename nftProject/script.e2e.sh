sleep 10;
npx prisma migrate dev --name init;
yarn test:e2e;
