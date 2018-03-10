import { inject } from "aurelia-framework";
import { DbService } from "dataservices/db-service";
import { Router } from "aurelia-router";
import { FileService } from "au-base/app/dataservices/file-service";

@inject(DbService, FileService, Router)
export class ViewDetails {
    view: IView;

    constructor(private db: DbService, private fileService: FileService, private router: Router) { }

    async activate({ viewId }) {
        this.view = await this.db.views.findById(viewId) || <IView>{};
    }

    async save() {
        await this.db.views.upsert(this.view);
        this.router.navigateToRoute("views");
    }
}