import { inject } from "aurelia-framework";
import { DbService } from "dataservices/db-service";

@inject(DbService)
export class __modelNamePluralCapitalize__ {
    __modelNamePluralCamelCase__: I__modelNameCapitalize__[] = [];

    constructor(private db: DbService) { }

    async activate() {
        this.__modelNamePluralCamelCase__ = await this.db.__modelNamePluralCamelCase__.find();
    }

    remove(__modelNameCamelCase__Id: string, index: number) {
        this.__modelNamePluralCamelCase__.splice(index, 1);
        this.db.__modelNamePluralCamelCase__.removeById(__modelNameCamelCase__Id)
    }
}