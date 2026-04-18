export class ConfigSetDTO {
    constructor(data: ConfigSetDTO) {
        Object.assign(this, data);
    }

    public name!:string;
    public value!:any;
}