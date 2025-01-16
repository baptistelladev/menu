import { PaymentMethodEnum } from "../enums/EnumPaymentMethod";
import { IPaymentMethod } from "../interfaces/IPaymentMethod";

export const MOCK_PAYMENT_METHODS: IPaymentMethod[] = [
  {
    text: 'Pix',
    value: PaymentMethodEnum.PIX
  },
  {
    text: 'Dinheiro',
    value: PaymentMethodEnum.DINHEIRO
  },
  {
    text: 'Débito',
    value: PaymentMethodEnum.CARTAO_DEBITO
  },
  {
    text: 'Crédito',
    value: PaymentMethodEnum.CARTAO_CREDITO
  },
]
