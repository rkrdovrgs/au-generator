import { MongoJsCollection, MongoJsService } from "au-base/app/mongo-js/collection";

export class DbService {
    models: MongoJsCollection<IModel> = null;
    projects: MongoJsCollection<IProject> = null;

    constructor() {
        MongoJsService.init(this);
    }
}