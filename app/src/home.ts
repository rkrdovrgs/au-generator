import { DbService } from "dataservices/db-service";
import { inject } from "aurelia-framework";

@inject(DbService)
export class Home {
    constructor(private db: DbService) { }

    async activate() {
        console.log(await this.db.categories.find());
    }
}