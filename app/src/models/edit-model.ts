import { inject } from "aurelia-framework";
import { DbService } from "dataservices/db-service";
import { Router } from "aurelia-router";
import * as _ from "lodash";

@inject(DbService, Router)
export class EditModel implements IModelDetailsViewModel {
    project: IProject;
    projectId: string;
    model: IModel;
    complexTypes: IModel[];
    selectedTemplate: string = "details";
    templateRef: Element;
    generators = {
        contracts: {
            view: "templates/contracts.html",
            generate: () => {
                let $templateRef = $(this.templateRef).find("pre").clone();
                return [
                    $templateRef.html()
                        .replace(/<!--.*-->/g, "")
                        .replace(/\s{4}\n/g, "")
                ];
            }
        },
        details: {
            view: "templates/details.html",
            generate: () => {
                let $templateRef = $(this.templateRef).clone();
                $templateRef.find("[au-target-id]")
                    .removeClass("au-target")
                    .removeAttr("au-target-id");

                $templateRef.find(".template-settings").remove();

                return [
                    $templateRef.html()
                        .replace(/data-t-attr-value-bind/g, "value.bind")
                        .replace(/data-t-attr-files-bind/g, "files.bind")
                        .replace(/data-t-attr-cehcked-bind/g, "checked.bind")
                        .replace(/data-t-attr-repeat-for/g, "repeat.for")
                        .replace(/data-t-attr-model-bind/g, "model.bind")
                        .replace(/data-t-attr-eval="([a-z\-]*)"/ig, "$1")
                        .replace(/data-t-attr-/g, "")
                        .replace(/class=""/g, "")
                        .replace(/\s?<!--anchor-->\s?/g, "")
                ];
            }
        }
    };

    constructor(private db: DbService, private router: Router) { }

    async activate({ modelId, projectId }) {
        this.projectId = projectId;
        this.project = await this.db.projects.findById(projectId);
        this.model = await this.db.models.findById(modelId) ||
            <IModel>{
                properties: [],
                projectId
            };
        this.setModelName();

        this.complexTypes = await this.db.models.find({ projectId });
    }

    setModelName() {
        this.model.namePlural = this.model.namePlural || `${this.model.name}s`;
        this.model.nameCamelCase = _.lowerFirst(this.model.name);
        this.model.nameCapitalize = _.upperFirst(this.model.name);
        this.model.nameKebab = _.kebabCase(this.model.name);
        this.model.namePluralCamelCase = _.lowerFirst(this.model.namePlural);
        this.model.namePluralCapitalize = _.upperFirst(this.model.namePlural);
        this.model.namePluralKebab = _.kebabCase(this.model.namePlural);
    }

    addProperty() {
        this.model.properties.push(<IProperty>{});
    }

    removeProperty(index) {
        this.model.properties.splice(index, 1);
    }

    async save() {
        await this.db.models.upsert(this.model);
        //this.router.navigateToRoute("project-models", { projectId: this.projectId });
    }

    generate() {
        let generator = this.generators[this.selectedTemplate],
            templates = generator.generate();
        templates.forEach(t => console.log(t));
    }

    datasourceMatcher(a = <any>{}, b = <any>{}) {
        return !!a.model && !!b.model &&

            a.model._id === b.model._id;
    }
}