export abstract class BaseDTO<Props> {
  constructor(props: Props) {
    Object.assign(this, props);
  }
  id?: any;
  user?: any;
  tenant?: any;
  createdAt?: string;
  updatedAt?: string;
}
