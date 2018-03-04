import { inject } from "aurelia-framework";
import { DbService } from "dataservices/db-service";


@inject(DbService)
export class Projects {
    projects: IProject[];

    constructor(private db: DbService) { }

    async activate() {
        this.projects = await this.db.projects.find();
    }
}

