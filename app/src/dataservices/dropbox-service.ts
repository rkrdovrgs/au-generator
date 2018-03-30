import { Dropbox } from "dropbox";
import { ApiService } from "au-base/app/api-service/api";
import { Container } from "aurelia-framework";
import { Storage } from "au-base/app/auth-lock/helpers/storage";

let accessToken: string;

export async function DropboxService(): Promise<Dropbox>;
export async function DropboxService<T>(callback?: (dropbox: Dropbox) => Promise<T>): Promise<T>;
export async function DropboxService(...args) {
    if (!accessToken) {
        let api = Container.instance.get(ApiService),
            storage = Container.instance.get(Storage);

        accessToken = await api.post(`api/generator/auth/token`, { userId: storage.userId }).then(r => r.text());
    }

    let dropbox = new Dropbox({ accessToken }),
        callback = args[0];

    if (callback) {
        return callback(dropbox);
    } else {
        return dropbox;
    }
}