import { inject } from "aurelia-framework";
import { DbService } from "dataservices/db-service";
import { ApiService } from "au-base/app/api-service/api";
import PromiseExtensions from "au-base/app/helpers/promise-extensions";
import * as alertify from "alertifyjs";
import * as _ from "lodash";
import { DropboxService } from "dataservices/dropbox-service";

@inject(DbService, ApiService)
export class Models {
    project: IProject;
    projectId: string;
    models: IModel[];
    generating = {};

    constructor(private db: DbService, private api: ApiService) { }

    async activate({ projectId }) {
        this.projectId = projectId;
        this.project = await this.db.projects.findById(projectId);
        this.models = await this.db.models.find({ projectId });
    }

    async generate(model: IModel) {
        let path = await new Promise<string>((res, rej) =>
            alertify.prompt("What would be the view path (e.g. admin/products)?", _.kebabCase(model.namePlural), ((result, value) => (result.cancel && rej()) || res(value)))
        );

        if (!path) { return; }

        path = path.replace(/\\/, "/");
        path.startsWith("/") && (path = path.substring(1));
        path.endsWith("/") && (path = path.substring(0, path.length - 1));

        if (!path) { return; }

        this.generating[model._id] = true;

        let templates = await this.api.get<ITemplate[]>(`/api/projects/${this.projectId}/models/${model._id}/templates`, { path });
        for (let t of templates) {
            await DropboxService(dropbox => dropbox.filesUpload({ path: `/${this.project.name}/app/src/${path}/${t.name}.${t.extension}`, contents: t.content }));
            await PromiseExtensions.wait(500);
        }
        this.generating[model._id] = false;
    }
}