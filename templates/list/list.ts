import { inject } from "aurelia-framework";
import { DbService } from "dataservices/db-service";

@inject(DbService)
export class __ModelName__ {
    __modelName__s: I__ModelName__ = [];

    constructor(private db: DbService) { }

    async activate() {
        this.__modelName__s = await this.db.__modelName__s.find();
    }
}