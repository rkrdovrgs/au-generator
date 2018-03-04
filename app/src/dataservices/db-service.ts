import { MongoJsCollection, MongoJsService } from "au-base/app/mongo-js/collection";

export class DbService {
    categories: MongoJsCollection<{}> = null;

    constructor() {
        MongoJsService.init(this);
    }
}