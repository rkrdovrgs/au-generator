import { inject } from "aurelia-framework";
import { DbService } from "dataservices/db-service";
import { Router } from "aurelia-router";

@inject(DbService, Router)
export class __modelNameCapitalize__Details {
    __modelNameCamelCase__: I__modelNameCapitalize__;

    constructor(private db: DbService, private router: Router) { }

    async activate({ __modelNameCamelCase__Id }) {
        this.__modelNameCamelCase__ = await this.db.__modelNamePluralCamelCase__.findById(__modelNameCamelCase__Id) || <I__modelNameCapitalize__>{};
    }

    async save() {
        await this.db.__modelNamePluralCamelCase__.upsert(this.__modelNameCamelCase__);
        this.router.navigateToRoute("__modelNamePluralKebab__");
    }
}