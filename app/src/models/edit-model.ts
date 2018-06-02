import { inject } from "aurelia-framework";
import { DbService } from "dataservices/db-service";
import { Router } from "aurelia-router";
import * as _ from "lodash";
import { DropboxService } from "dataservices/dropbox-service";
import PromiseExtensions from "au-base/app/helpers/promise-extensions";
import * as alertify from "alertifyjs";


@inject(DbService, Router, Element)
export class EditModel implements IModelDetailsViewModel {
    project: IProject;
    projectId: string;
    path: string;
    model: IModel;
    modelChangedTimeoutId: NodeJS.Timer;
    complexTypes: IModel[];
    selectedTemplate: string = "routes.ts";
    templateRef: Element;
    datasourcedControlTypes = ["select"];
    generating: boolean;
    generators = {
        "contracts.d.ts": {
            view: "templates/contracts.d.ts.html",
            generate: () => {
                let $templateRef = $(this.templateRef).find("pre").clone();
                return {
                    [`${this.model.nameKebab}.contracts.d.ts`]: $templateRef.html()
                        .replace(/<!--.*-->/g, "")
                        .replace(/\s{4}\n/g, "")
                };
            }
        },
        "details": {
            view: "templates/details.html",
            generate: () => {
                let $htmlTemplateRef = $(this.templateRef).find("#html-template").clone(),
                    htmlTemplate = this.parseHtmlTemplate($htmlTemplateRef);

                let $tsTemplateRef = $(this.templateRef).find("#ts-template pre").clone(),
                    tsTemplate = this.parseTsTemplate($tsTemplateRef);

                return {
                    [`${this.model.nameKebab}-details.html`]: htmlTemplate,
                    [`${this.model.nameKebab}-details.ts`]: tsTemplate
                };
            }
        },
        "list": {
            view: "templates/list.html",
            generate: () => {
                let $htmlTemplateRef = $(this.templateRef).find("#html-template").clone(),
                    htmlTemplate = this.parseHtmlTemplate($htmlTemplateRef);

                let $tsTemplateRef = $(this.templateRef).find("#ts-template pre").clone(),
                    tsTemplate = this.parseTsTemplate($tsTemplateRef);

                return {
                    [`${this.model.namePluralKebab}.html`]: htmlTemplate,
                    [`${this.model.namePluralKebab}.ts`]: tsTemplate
                };
            }
        },
        "routes.ts": {
            view: "templates/routes.ts.html",
            generate: () => {
                let $tsTemplateRef = $(this.templateRef).find("#ts-template pre").clone(),
                    tsTemplate = this.parseTsTemplate($tsTemplateRef);

                return {
                    [`${this.model.namePluralKebab}.ts`]: tsTemplate
                }
            }
        }
    };

    parseHtmlTemplate($htmlTemplateRef: JQuery) {
        $htmlTemplateRef.find("[au-target-id]")
            .removeClass("au-target")
            .removeAttr("au-target-id");

        $htmlTemplateRef.find(".template-settings").remove();
        let htmlTemplate = $htmlTemplateRef.html()
            .replace(/data-t-attr-value-bind/g, "value.bind")
            .replace(/data-t-attr-files-bind/g, "files.bind")
            .replace(/data-t-attr-cehcked-bind/g, "checked.bind")
            .replace(/data-t-attr-repeat-for/g, "repeat.for")
            .replace(/data-t-attr-model-bind/g, "model.bind")
            .replace(/data-t-attr-eval="([a-z\-]*)"/ig, "$1")
            .replace(/data-t-attr-/g, "")
            .replace(/class=""/g, "")
            .replace(/\s?<!--anchor-->\s?/g, "");

        return htmlTemplate;
    }

    parseTsTemplate($tsTemplateRef: JQuery) {
        let tsTemplate = $tsTemplateRef.html()
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/<!--.*-->/g, "")
            .replace(/\s{4}\n/g, "");

        return tsTemplate;
    }

    constructor(private db: DbService, private router: Router, private element: Element) { }

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

    attached() {
        $(this.element).find("#selected-template").bind("DOMSubtreeModified", this.modelChanged.bind(this));
        $(this.element).on("change", "input,select", this.modelChanged.bind(this));
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

    modelChanged() {
        if (this.modelChangedTimeoutId) { return; }
        this.modelChangedTimeoutId = setTimeout(async () => {
            await this.db.models.upsert(this.model);
            this.modelChangedTimeoutId = null;
        }, 1000);
    }

    async save() {
        await this.db.models.upsert(this.model);
        //this.router.navigateToRoute("project-models", { projectId: this.projectId });
    }

    async generate() {
        let generator = this.generators[this.selectedTemplate],
            templates: { [filename: string]: string } = generator.generate();

        /*
        _.each(templates, t => {
            console.log(t);
        });
        return;
        */
        if (!this.path) {
            this.path = await new Promise<string>((res, rej) =>
                alertify.prompt("What would be the view path (e.g. admin/products)?", _.kebabCase(this.model.namePlural), ((result, value) => (result.cancel && rej()) || res(value)))
            );

            if (!path) { return; }

            path = path.replace(/\\/, "/");
            path.startsWith("/") && (path = path.substring(1));
            path.endsWith("/") && (path = path.substring(0, path.length - 1));

            if (!path) { return; }

        }
        this.generating = true;

        for (let t in templates) {
            if (templates.hasOwnProperty(t)) {
                await DropboxService(dropbox => dropbox.filesUpload({ path: `/${this.project.name}/app/src/${path}/${t}`, contents: templates[t] }));
                await PromiseExtensions.wait(500);
            }
        }
        this.generating = false;
    }

    datasourceMatcher(a = <any>{}, b = <any>{}) {
        return !!a.model && !!b.model &&
            a.model._id === b.model._id;
    }

    propertiesWithDatasource(): (prop: IProperty) => boolean {
        return prop => this.datasourcedControlTypes.includes(prop.controlType) && !!prop.datasource && !!prop.datasource.model;
    }

    datasourceChanged() {
        this.model.properties = [...this.model.properties];
    }
}