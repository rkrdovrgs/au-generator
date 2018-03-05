import { inject } from "aurelia-framework";
import { DbService } from "dataservices/db-service";

@inject(DbService)
export class __modelNameCapitalize__Details {
    __modelNameCamelCase__: I__modelNameCapitalize__;

    constructor(private db: DbService) { }

    async activate({ __modelNameCamelCase__Id }) {
        this.__modelNameCamelCase__ = await this.db.__modelNamePluralCamelCase__.findById(__modelNameCamelCase__Id) || <I__modelNameCapitalize__>{};
    }

    save() {
        this.db.__modelNamePluralCamelCase__.upsert(this.__modelNameCamelCase__);
    }
}