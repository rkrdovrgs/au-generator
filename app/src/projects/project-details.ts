import { inject } from "aurelia-framework";
import { DbService } from "dataservices/db-service";

@inject(DbService)
export class ProjectDetails {
    project: IProject;

    constructor(private db: DbService) { }

    async activate({ projectId }) {
        this.project = await this.db.projects.findById(projectId) || <IProject>{};
    }

    saveProject() {
        this.db.projects.upsert(this.project);
    }
}

