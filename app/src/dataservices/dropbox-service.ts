import { Dropbox } from "dropbox";
import { ApiService } from "au-base/app/api-service/api";
import { inject, Container } from "aurelia-framework";
import { Storage } from "au-base/app/auth-lock/helpers/storage";

let accessToken: string;
export async function DropboxService(): Promise<Dropbox> {
    if (!accessToken) {
        let api = Container.instance.get(ApiService),
            storage = Container.instance.get(Storage);

        accessToken = await api.post(`api/generator/auth/token`, { userId: storage.userId }).then(r => r.text());
    }

    return new Dropbox({ accessToken });
}