import app from "./app";
import config from "./config";
import { prisma } from "./lib/prisma";
const PORT = config.PORT;

const main = async () => {
  try {
    await prisma.$connect(); // connect prisma
    console.log(`database connected success!`);
    app.listen(PORT, () => {
      console.log(`app running on ${PORT}`);
    });
  } catch (error) {
    console.log(`app got an error ${error}`);
    await prisma.$disconnect();
    process.exit(1);
  }
};

main();
