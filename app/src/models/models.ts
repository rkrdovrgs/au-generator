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

    generate(modelId: string, templateType: string) {
        ["ts", "html", "less", "md"].forEach((extension, i) => {
            setTimeout(() => window.location.href = `/api/projects/${this.projectId}/models/${modelId}/template-generators/${templateType}.${extension}`, i * 1000);
        });
    }
}