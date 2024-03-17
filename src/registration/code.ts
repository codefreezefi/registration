const characters = `ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`;

export const generateCode = (len = 6): string => {
  let code = ``;
  for (let n = 0; n < len; n++) {
    code = `${code}${
      characters[Math.floor(Math.random() * characters.length)]
    }`;
  }
  return code;
};
