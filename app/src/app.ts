import { Router } from "aurelia-router";
import { inject } from "aurelia-framework";
import { AuthenticationHelper } from "au-base/app/auth-lock/helpers/authentication-helper";
import { RouteConfiguration } from "au-base/app/config/route-config";
import routes from "config/routes";
import projectInfo from "config/project-info";
import { AuthComponent } from "au-base/app/auth-lock/helpers/auth-component";

@inject(AuthenticationHelper, RouteConfiguration)
export class App extends AuthComponent {
    router: Router;

    constructor(private authenticationHelper: AuthenticationHelper, private routeConfiguration: RouteConfiguration, ...dependencies) {
        super(...dependencies);
    }


    configureRouter(config, router: Router) {
        config.title = projectInfo.projectTitle;

        //configuring routes    
        this.routeConfiguration.configure(config, routes);

        //configuring authentication
        this.authenticationHelper.configureAuth(config);
        this.router = router;
    }
}