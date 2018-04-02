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

        - Make sure dropbox is running
        - Configure dropbox selective sync to avoid syncing the node_modules folder:
            On the system tray, locate the dropbox icon, 
            Right-click the dropbox icon
            Select "Preferences"
            Click "Sync"
            Click "Selective Sync"
            Deselect "Apps/au-generator/${this.project.name}/node_modules"

        - Install the project dependencies by running:
            npm install

        - To run the app:
            npm run start:dev
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

