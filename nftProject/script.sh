sleep 10;
npx prisma migrate dev --name init;
if [ "${E2E_TESTS}" -eq 1 ] ; then
    yarn test:e2e;
else
  yarn seed;
  yarn start:dev;
fi

