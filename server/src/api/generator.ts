import * as express from "express";
import { connection, ObjectId } from "au-base/server/db/connection";
import * as fs from "fs";
import * as path from "path";
import * as _ from "lodash";
import * as Archiver from "archiver";


interface ITemplateModel extends IModel {
    nameCamelCase: string;
    nameCapitalize: string;
    nameKebab: string;
    namePluralCamelCase: string;
    namePluralCapitalize: string;
    namePluralKebab: string;
}

interface ITemplate {
    content: string;
    name: string;
    extension: string;
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
                result.nameKebab = _.kebabCase(result.name);
                result.namePluralCamelCase = _.lowerFirst(result.namePlural);
                result.namePluralCapitalize = _.upperFirst(result.namePlural);
                result.namePluralKebab = _.kebabCase(result.namePlural);
                res(result);
            });
    });
}

function replaceModelName(content: string, model: ITemplateModel): string {
    return content
        .replace(/__modelNameCamelCase__/g, model.nameCamelCase)
        .replace(/__modelNameCapitalize__/g, model.nameCapitalize)
        .replace(/__modelNameKebab__/g, model.nameKebab)
        .replace(/__modelNamePluralCamelCase__/g, model.namePluralCamelCase)
        .replace(/__modelNamePluralCapitalize__/g, model.namePluralCapitalize)
        .replace(/__modelNamePluralKebab__/g, model.namePluralKebab);
}


router.get("/api/projects/:projectId/models/:modelId/templates", async (req, res) => {
    let model = await getModel(req.params.modelId);

    // Tell the browser that this is a zip file.
    res.writeHead(200, {
        "Content-Type": "application/zip",
        "Content-disposition": `attachment; filename=${model.namePluralKebab}.zip`
    });

    var zip = Archiver('zip');

    // Send the file to the page output.
    zip.pipe(res);

    templateGenerators.forEach(tg => {
        let template: ITemplate = tg(model);
        zip.append(template.content, { name: `${template.name}.${template.extension}` });
    });

    zip.finalize();
});

const templateGenerators = [
    (model: ITemplateModel) => {
        let content = fs.readFileSync(path.resolve("./templates/list/list.ts"), "utf8");
        content = replaceModelName(content, model);

        return {
            name: model.namePluralKebab,
            extension: "ts",
            content
        }
    },

    (model: ITemplateModel) => {
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

        return {
            name: model.namePluralKebab,
            extension: "html",
            content
        }
    },

    (model: ITemplateModel) => {

        let content = fs.readFileSync(path.resolve("./templates/list/list.less"), "utf8");
        content = replaceModelName(content, model);

        return {
            name: model.namePluralKebab,
            extension: "less",
            content
        }
    },

    (model: ITemplateModel) => {
        let content = fs.readFileSync(path.resolve("./templates/details/details.ts"), "utf8");
        content = replaceModelName(content, model);

        return {
            name: `${model.nameKebab}-details`,
            extension: "ts",
            content
        }
    },

    (model: ITemplateModel) => {
        let content = fs.readFileSync(path.resolve("./templates/details/details.html"), "utf8");
        content = replaceModelName(content, model);

        let properties = model.properties.map(p => {
            return `<div class="form-group"><label>${p.name}: </label><input type="text" value.bind="${model.nameCamelCase}.${p.name}" class="form-control" /></div>`;
        }).join("\n    ");
        content = content.replace(/__properties__/g, properties);

        return {
            name: `${model.nameKebab}-details`,
            extension: "html",
            content
        }
    },

    (model: ITemplateModel) => {

        let content = fs.readFileSync(path.resolve("./templates/details/details.less"), "utf8");
        content = replaceModelName(content, model);

        return {
            name: `${model.nameKebab}-details`,
            extension: "less",
            content
        }
    },

    (model: ITemplateModel) => {
        let content = fs.readFileSync(path.resolve("./templates/list/list.md"), "utf8");
        content = replaceModelName(content, model);

        return {
            name: model.namePluralKebab,
            extension: "md",
            content
        }
    },

    (model: ITemplateModel) => {
        let content = `interface I${model.nameCapitalize} {`;


        content += `\n    `;
        content += `_id: string;`;

        model.properties.forEach(p => {
            content += `\n    `;
            content += `${p.name}: ${p.dataType || "any"}${p.isArray ? "[]" : ""};`;
        });

        content += `\n}`;

        return {
            name: model.namePluralKebab,
            extension: "contracts.d.ts",
            content
        }
    }
];

module.exports = router;