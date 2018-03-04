import "jquery";
import "bootstrap";
import { Aurelia } from "aurelia-framework";
import environment from "environment";
//import reducers from "appState/reducers";
import * as config from "au-config";
import { AuthLockConfig } from "au-base/app/auth-lock/base-config";

//Configure Bluebird Promises.
//Note: You may want to use environment-specific configuration.
(<any>Promise).config({
    warnings: {
        wForgottenReturn: false
    }
});

export function configure(aurelia: Aurelia) {
    //needed to add as global variable to be used with kendo export excel
    //window["JSZip"] = window["JSZip"] || JSZip;
    aurelia.use
        .standardConfiguration()
        //globalize features
        .feature("au-base/app/resources")
        //load plugins
        .plugin("aurelia-dialog")
        //.plugin("shared/redux-base/config", (createStore: IReduxStoreCreator) => createStore(reducers, environment.debug))
        .plugin("au-base/app/auth-lock/auth0", (baseConfig: AuthLockConfig) => {
            baseConfig.configure(config as IAppConfiguration);
        })
        .plugin("aurelia-computed", {
            enableLogging: environment.debug
        });

    if (environment.debug) {
        aurelia.use.developmentLogging();
    }

    if (environment.testing) {
        aurelia.use.plugin("aurelia-testing");
    }

    aurelia.start().then(() => aurelia.setRoot());
}
