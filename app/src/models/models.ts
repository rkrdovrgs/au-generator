import { inject } from "aurelia-framework";
import { DbService } from "dataservices/db-service";

@inject(DbService)
export class Models {
    models: IModel[];

    constructor(private db: DbService) { }

    async activate() {
        this.models = await this.db.models.find();
    }
}