import { inject } from "aurelia-framework";
import { DbService } from "dataservices/db-service";
import { DropboxService } from "dataservices/dropbox-service";

@inject(DbService)
export class Views {
    project: IProject;
    views: IView[] = [];
    existingViews;

    constructor(private db: DbService) { }

    async activate({ projectId }) {
        this.project = await this.db.projects.findById(projectId);
        this.views = await this.db.views.find({ projectId });
    }

    remove(viewId: string, index: number) {
        this.views.splice(index, 1);
        this.db.views.removeById(viewId)
    }
}