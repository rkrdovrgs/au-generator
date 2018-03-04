export default [
    {
        route: ["", "/projects"],
        moduleId: "projects/projects",
        title: "Projects",
        name: "projects"
    },
    {
        route: "/projects/add",
        moduleId: "projects/project-details",
        title: "Add Project",
        name: "project-details-add",
        elementId: "project-details"
    },
    {
        route: "/projects/:projectId",
        moduleId: "projects/project-details",
        title: "Project Details",
        name: "project-details"
    },
    {
        route: "/models/add",
        moduleId: "models/edit-model",
        title: "Add Model",
        name: "add-model"
    },
    {
        route: "/models/edit/:modelId",
        moduleId: "models/edit-model",
        title: "Edit Model",
        name: "edit-model"
    },
    {
        route: "/projects/:projectId/models",
        moduleId: "models/models",
        title: "Models",
        elementId: "models",
        name: "project-models"
    },
    {
        route: "/models/template-generators/:modelId/list",
        moduleId: "template-generators/list/list",
        title: "Generate List",
        name: "template-generators-list"
    },
] as Array<IRoute>;