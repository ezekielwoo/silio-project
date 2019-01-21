export class AddCrypto {
  constructor(
    public name:string,
    public symbol:string,
    public market:number,
    public amount:number,
    public purchasePrice:number,
    public value: number,
    public coinExist: boolean,
    public type: string
  )
  {}
}
