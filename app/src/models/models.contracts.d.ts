
interface IProperty {
    name: string;
    dataType: string;
    controlType: string;
    displayType: string;
    dataSource: string;
    isArray: boolean;
}

interface IModel {
    _id: string;
    projectId: string;
    name: string;
    properties: IProperty[];
}