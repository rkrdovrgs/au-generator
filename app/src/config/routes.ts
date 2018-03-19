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
        route: "/projects/:projectId/models/add",
        moduleId: "models/edit-model",
        title: "Add Model",
        name: "project-add-model",
        elementId: "project-model-details"
    },
    {
        route: "/projects/:projectId/models/edit/:modelId",
        moduleId: "models/edit-model",
        title: "Edit Model",
        name: "project-edit-model",
        elementId: "project-model-details"
    },
    {
        route: "/projects/:projectId/models",
        moduleId: "models/models",
        title: "Models",
        elementId: "models",
        name: "project-models"
    },
    {
        route: "/projects/:projectId/views",
        moduleId: "views/views",
        title: "Views",
        name: "project-views",
        elementId: "project-views"
    },
    {
        route: "/views/add",
        moduleId: "views/view-details",
        title: "Add View",
        name: "view-details-add",
        elementId: "view-details"
    },
    {
        route: "/views/:viewId",
        moduleId: "views/view-details",
        title: "View Details",
        name: "view-details-edit",
        elementId: "view-details"
    }
] as Array<IRoute>;