import * as express from "express";
import { connection, ObjectId } from "au-base/server/db/connection";
import * as fs from "fs";
import * as path from "path";

interface IFileUploadRequest extends Express.Request {
    files: IFile[];
}

const router = express.Router();
const db = connection("models");


router.get("/api/projects/:projectId/models/:modelId/template-generators/list", (req, res) => {
    let model = db.models.findOne(
        { _id: ObjectId(req.params.modelId) },
        (err, result) => {
            if (err) { res.send(err); }
            result.name = `${result.name[0].toUpperCase()}${result.name.toLowerCase().substring(1)}`;
            result.pluralName = (result.pluralName || `${result.name}s`).toLowerCase();

            let content = fs.readFileSync(path.resolve("./templates/list/list.ts"), "utf8");
            content = content.replace(/__ModelName__/ig, result.name)
                .replace(/__modelNamePlural__/g, result.namePlural);
            res.setHeader("Content-disposition", `attachment; filename=${result.namePlural}.ts`);
            res.send(content);
        });
});

module.exports = router;