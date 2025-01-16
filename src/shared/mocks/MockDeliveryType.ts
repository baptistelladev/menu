import { DeliveryTypeEnum } from "../enums/EnumDeliveryType";
import { IDeliveryType } from "../interfaces/IDeliveryType";

export const MOCK_DELIVERY_TYPE: IDeliveryType[] = [
  {
    text: 'Retirar no local',
    value: DeliveryTypeEnum.PICK_UP
  },
  {
    text: 'Entregar',
    value: DeliveryTypeEnum.DELIVERY
  }
]
