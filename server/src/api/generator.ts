import * as express from "express";
import { connection } from "../db/connection";
import * as fs from "fs";
import * as path from "path";

interface IFileUploadRequest extends Express.Request {
    files: IFile[];
}

const router = express.Router();
const db = connection("models");


router.get("/api/generator/:modelName/list", (req, res) => {
    let content = fs.readFileSync(path.resolve("./server/templates/list/list.ts"), "utf8");
    content = content.replace(/__ModelName__/ig, req.params.modelName);
    res.setHeader('Content-disposition', 'attachment; filename=' + req.params.modelName + '.ts');
    res.contentType("text");
    res.send(content);
});

module.exports = router;