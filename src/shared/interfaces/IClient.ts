
export interface IClient {
  name: string,
  document: string,
  phone: string,
  address: {
    street : string,
    number : string,
    neighborhood : string,
    complement : string,
    city : string,
    reference : string
  }
}
