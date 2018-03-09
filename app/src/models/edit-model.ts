import { inject } from "aurelia-framework";
import { DbService } from "dataservices/db-service";
import { Router } from "aurelia-router";

@inject(DbService, Router)
export class EditModel {
    projectId: string;
    model: IModel;
    complexTypes: IModel[];

    constructor(private db: DbService, private router: Router) { }

    async activate({ modelId, projectId }) {
        this.projectId = projectId;
        this.model = await this.db.models.findById(modelId) || <IModel>{
            properties: [],
            projectId
        };

        this.complexTypes = await this.db.models.find({ projectId });
    }

    addProperty() {
        this.model.properties.push(<IProperty>{});
    }

    removeProperty(index) {
        this.model.properties.splice(index, 1);
    }

    async save() {
        await this.db.models.upsert(this.model);
        this.router.navigateToRoute("project-models", { projectId: this.projectId });
    }
}