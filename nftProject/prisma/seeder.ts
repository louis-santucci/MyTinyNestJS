import { PrismaClient } from '@prisma/client';
import { Role, Status } from '.prisma/client';
import * as dotenv from 'dotenv';
import { async } from 'rxjs';

const prisma = new PrismaClient();

const fakerUser = async (
  name: string,
  email: string,
  password: string,
  role: Role,
  blockchainAddress: string,
  teamId?: number,
) => {
  await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: password,
      role: role,
      blockchainAddress: blockchainAddress,
      teamId: teamId ? teamId : null,
    },
  });
};

const fakerTeam = async (
  name: string,
  leaderEmail: string,
  balance: number,
) => {
  await prisma.team.create({
    data: {
      name: name,
      leaderEmail: leaderEmail,
      balance: balance,
    },
  });
};

const fakerCollection = async (
  name: string,
  imageName: string,
  status: Status,
  teamId: number,
) => {
  await prisma.nftCollection.create({
    data: {
      name: name,
      imageName: imageName,
      status: status,
      rate: -1,
      teamId: teamId,
    },
  });
};

const fakerNFT = async (
  name: string,
  userId: number,
  imageName: string,
  price: number,
  status: Status,
  nftCollectionId: number,
) => {
  await prisma.nft.create({
    data: {
      name: name,
      userId: userId,
      imageName: imageName,
      price: price,
      status: status,
      nftCollectionId: nftCollectionId,
      history: '' + userId,
      rate: -1,
      nbRates: 0,
    },
  });
};

const fakerSale = async (
  buyerId: number,
  sellerId: number,
  nftId: number,
) => {
  await prisma.sale.create({
    data: {
      buyerId: buyerId,
      sellerId: sellerId,
      nftId: nftId
    }
  });
}

async function main() {
  dotenv.config();
  console.log('Seeding database...');

  // --------- Teams ---------------

  await fakerTeam('Team 01', 'john.travolta@gmail.com', 5000);
  await fakerTeam('Team 02', 'admin@admin.fr', 10000);

  // --------- Users ---------------
  await fakerUser(
    'Admin',
    'admin@gmail.com',
    'password',
    Role.ADMIN,
    '0x0eb81892540747ec60f1389ec734a2c0e5f9f735',
    2,
  );
  await fakerUser(
    'John Travolta',
    'john.travolta@gmail.com',
    '12345678',
    Role.USER,
    '0x0eb81692540747ec60f1389ec734a2c0e5f9f735',
    1,
  );
  await fakerUser(
    'Jack Uzi',
    'jack.uzi@gmail.com',
    '12345678',
    Role.USER,
    '0x0eb81692540747ec60f1389ec734a2c0e5f9f875',
  );

  // --------- NFT Collections ---------------

  await fakerCollection('Memes', 'logoCol1.jpg', Status.PUBLISHED, 1);
  await fakerCollection('Animals', 'logoCol2.jpg', Status.DRAFT, 2);

  // --------- NFT ---------------

  await fakerNFT('Nyan Cat', 2, 'nyan_cat.jpg', 420, Status.PUBLISHED, 1);
  await fakerNFT('Harambe', 2, 'harambe.jpg', 69, Status.PUBLISHED, 1);
  await fakerNFT('Poker Face', 2, 'poker.jpg', 666, Status.PUBLISHED, 1);
  await fakerNFT('Lord Farquaad', 2, 'farquaad.jpg', 42, Status.PUBLISHED, 1);

  await fakerNFT('Platipus', 1, 'platipus.jpg', 50, Status.DRAFT, 2);
  await fakerNFT('Nazic', 1, 'nazic.jpg', 69420, Status.DRAFT, 2);

  // --------- Sale ---------------
  await fakerSale(3, 2, 1);
  await fakerSale(3, 2, 2);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
