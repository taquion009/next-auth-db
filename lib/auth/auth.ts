import { hash, genSalt, compare } from "bcryptjs";

export const hashPassword = async (password: any) => {
  const salt = await genSalt(12);

  if (!salt) return;

  const hashedPassword = await hash(password, salt);

  return hashedPassword;
};

export const verifyPassword = async (password: any, hashedPassword: any) => {
  try {
    const isValid = await compare(password, hashedPassword);
    return isValid;
  } catch (error: any) {
    throw new Error(error);
  }
};
