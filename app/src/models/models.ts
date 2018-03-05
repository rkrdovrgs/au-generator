import { inject } from "aurelia-framework";
import { DbService } from "dataservices/db-service";

@inject(DbService)
export class Models {
    projectId: string;
    models: IModel[];

    constructor(private db: DbService) { }

    async activate({ projectId }) {
        this.projectId = projectId;
        this.models = await this.db.models.find({ projectId });
    }
}