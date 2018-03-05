import { inject } from "aurelia-framework";
import { DbService } from "dataservices/db-service";

@inject(DbService)
export class __ModelName__ {
    __modelNamePlural__: I__ModelName__ = [];

    constructor(private db: DbService) { }

    async activate() {
        this.__modelNamePlural__ = await this.db.__modelNamePlural__.find();
    }
}