import * as express from "express";
import { connection, ObjectId } from "au-base/server/db/connection";
import * as fs from "fs";
import * as path from "path";
import * as _ from "lodash";


interface ITemplateModel extends IModel {
    nameCamelCase: string;
    nameCapitalize: string;
    namePluralCamelCase: string;
    namePluralCapitalize: string;
}

const router = express.Router();
const db = connection("models");

function getModel(modelId): Promise<ITemplateModel> {
    return new Promise((res, rej) => {
        db.models.findOne(
            { _id: ObjectId(modelId) },
            (err, result: ITemplateModel) => {
                if (err) rej(err);
                result.namePlural = result.namePlural || `${result.name}s`;
                result.nameCamelCase = _.lowerFirst(result.name);
                result.nameCapitalize = _.upperFirst(result.name);
                result.namePluralCamelCase = _.lowerFirst(result.namePlural);
                result.namePluralCapitalize = _.upperFirst(result.namePlural);
                res(result);
            });
    });
}

function replaceModelName(content: string, model: ITemplateModel): string {
    return content
        .replace(/__modelNameCamelCase__/g, model.nameCamelCase)
        .replace(/__modelNameCapitalize__/g, model.nameCapitalize)
        .replace(/__modelNamePluralCamelCase__/g, model.namePluralCamelCase)
        .replace(/__modelNamePluralCapitalize__/g, model.namePluralCapitalize);
}


router.get("/api/projects/:projectId/models/:modelId/template-generators/list.ts", async (req, res) => {
    let model = await getModel(req.params.modelId);

    let content = fs.readFileSync(path.resolve("./templates/list/list.ts"), "utf8");
    content = replaceModelName(content, model);

    res.setHeader("Content-disposition", `attachment; filename=${model.namePluralCamelCase}.ts`);
    res.send(content);

});

router.get("/api/projects/:projectId/models/:modelId/template-generators/list.html", async (req, res) => {
    let model = await getModel(req.params.modelId);

    let content = fs.readFileSync(path.resolve("./templates/list/list.html"), "utf8");
    content = replaceModelName(content, model);

    let propertyHeaders = model.properties.map(p => {
        return `<div class="col col-xs-1">${p.name}</div>`;
    }).join("\n        ");
    content = content.replace(/__propertyHeaders__/g, propertyHeaders);

    let propertyRows = model.properties.map(p => {
        return `<div class="col col-xs-1">\${m.${p.name}}</div>`;
    }).join("\n        ");
    content = content.replace(/__propertyRows__/g, propertyRows);

    res.setHeader("Content-disposition", `attachment; filename=${model.namePluralCamelCase}.html`);
    res.send(content);

});

router.get("/api/projects/:projectId/models/:modelId/template-generators/list.less", async (req, res) => {
    let model = await getModel(req.params.modelId);

    let content = fs.readFileSync(path.resolve("./templates/list/list.less"), "utf8");
    content = replaceModelName(content, model);

    res.setHeader("Content-disposition", `attachment; filename=${model.namePluralCamelCase}.less`);
    res.send(content);

});

router.get("/api/projects/:projectId/models/:modelId/template-generators/list.md", async (req, res) => {
    let model = await getModel(req.params.modelId);

    let content = fs.readFileSync(path.resolve("./templates/list/list.md"), "utf8");
    content = replaceModelName(content, model);

    res.setHeader("Content-disposition", `attachment; filename=${model.namePluralCamelCase}.md`);
    res.send(content);

});

module.exports = router;