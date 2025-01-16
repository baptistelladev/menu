import { MaskitoOptions } from "@maskito/core";

export const CPF_MASK: MaskitoOptions = {
  mask: [/\d/, /\d/, /\d/, '.',  /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/]
};

export const PHONE_MASK: MaskitoOptions = {
  mask: ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/ ]
};

export const MONEY_MASK: MaskitoOptions = {
  mask: [
    'R$', // Prefixo da moeda
    /\d/, /\d/, /\d{0,3}/, // Parte inteira com até 3 dígitos
    '.', // Separador de milhar
    /\d/, /\d/, /\d/, // Milhares
    '.', // Separador de milhar
    /\d/, /\d/ // Centavos (duas casas decimais)
  ],
};
