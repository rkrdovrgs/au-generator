import { DbService } from "dataservices/db-service";
import { inject } from "aurelia-framework";

@inject(DbService)
export class Home {
    constructor(private db: DbService) { }
}