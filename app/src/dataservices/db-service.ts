import { MongoJsCollection } from "au-base/app/mongo-js/collection";

export class DbService {
    categories: MongoJsCollection<{}> = null;

    constructor() {
        Object.keys(this).forEach(collection => { this[collection] = new MongoJsCollection().of(collection); });
    }
}