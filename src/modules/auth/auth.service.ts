import bcrypt from "bcrypt";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { IRegisterUser } from "./auth.interface";

const regUserDb = async (payload: IRegisterUser) => {
  const { email, password, name, phone } = payload;
  const hashPassword = await bcrypt.hash(
    password,
    Number(config.BCRYPT_SALT_ROUNDS),
  );

  const result = await prisma.user.create({
    data: {
      email,
      password: hashPassword,
      name,
      phone,
    },
  });

  const userData = await prisma.user.findUnique({
    where: {
      email: result.email,
    },
    omit: { password: true },
  });

  return userData;
};

const loginUserDb = async () => {
  
};

export { regUserDb };
