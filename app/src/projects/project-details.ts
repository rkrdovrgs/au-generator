import { inject } from "aurelia-framework";
import { DbService } from "dataservices/db-service";
import { DropboxService } from "dataservices/dropbox-service";

@inject(DbService)
export class ProjectDetails {
    project: IProject;
    isSaving: boolean;
    instructions: string;

    constructor(private db: DbService) { }

    async activate({ projectId }) {
        this.project = await this.db.projects.findById(projectId) || <IProject>{};
        this.setInstructions();
    }

    setInstructions() {
        this.instructions = `
        #Git & Github
        - Create a new repository at: https://github.com/new

        - Run the following commands:

            1. git init
            2. git remote add upstream https://github.com/rkrdovrgs/au-skeleton.git
               or
               git remote add upstream git@github.com:rkrdovrgs/au-skeleton.git
            3. git pull upstream master
            4. git remote add origin <URL_OF_NEW_REPO>
            5. git push --set-upstream origin master
            6. mkdir node_modules

        #Dropbox
        - Make sure dropbox is running
        - Configure dropbox selective sync to avoid syncing the node_modules folder:
            On the system tray, locate the dropbox icon, 
            Right-click the dropbox icon
            Select "Preferences"
            Click "Sync"
            Click "Selective Sync"
            Deselect "Apps/au-generator/${this.project.name}/node_modules"

        #Running the app
        - Install the project dependencies by running:
            npm install

        - Run the app:
            npm run start:dev

        #Heroku
        - Create a new app at: https://dashboard.heroku.com/new-app
            Strongly recommend to use the same name as the git repo name
        - Go to newly created app
        
        - Go to the tab "Resources"
        - On the "Add-ons" section, search for "mLab Mongo DB"
        - Select "mLab Mongo DB", and when the pop-up opens, click "Provision"

        - Go to the tab "Deploy
        - On the deployment method select "Github"
        - Search for the repo name: ${this.project.name}
        - Click "Connect"

        #Making changes to your app
        - To start the app locally run
            npm run start:dev
        
        - To upload a change to Github:
            git add .
            git commit -m "<message>"
            git push

        - To deploy the latest version of the app to heroku:
            Go to Heroku at: https://dashboard.heroku.com/apps/${this.project.name}/deploy/github
            Scroll down and click "Deploy Branch"
        `;
    }

    async saveProject() {
        this.isSaving = true;
        let dropbox = await DropboxService();

        await this.db.projects.upsert(this.project);
        await dropbox.filesUpload({ path: `/${this.project.name}/instructions.md`, contents: this.instructions });

        this.isSaving = false;
    }
}

