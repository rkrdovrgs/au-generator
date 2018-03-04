import { inject } from "aurelia-framework";
import { DbService } from "dataservices/db-service";
import { Router } from "aurelia-router";

@inject(DbService, Router)
export class EditModel {
    model = <IModel>{
        properties: []
    };
    complexTypes: IModel[];

    constructor(private db: DbService, private router: Router) { }

    async activate({ modelId }) {
        if (!!modelId) {
            this.model = await this.db.models.findById(modelId);
        }
        this.complexTypes = await this.db.models.find();
    }

    addProperty() {
        this.model.properties.push(<IProperty>{});
    }

    removeProperty(index) {
        this.model.properties.splice(index, 1);
    }

    async save() {
        if (!this.model._id) {
            await this.db.models.insert(this.model);
        } else {
            await this.db.models.updateById(this.model._id, this.model);
        }

        this.router.navigateToRoute("models");
    }
}