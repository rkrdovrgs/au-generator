import { MongoJsCollection, MongoJsService } from "au-base/app/mongo-js/collection";

export class DbService {
    models: MongoJsCollection<IModel> = null;
    projects: MongoJsCollection<IProject> = null;
    views: MongoJsCollection<IView> = null;

    constructor() {
        MongoJsService.init(this);
    }
}