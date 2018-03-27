
interface IProperty {
    name: string;
    dataType: string;
    controlType: string;
    displayType: string;
    datasource: {
        index: number;
        model: IModel;
    };
    datasourceText: string;
    datasourceValue: string;
    isArray: boolean;
}

interface IModel {
    _id: string;
    projectId: string;
    name: string;
    namePlural: string;
    properties: IProperty[];

    nameCamelCase: string;
    nameCapitalize: string;
    nameKebab: string;
    namePluralCamelCase: string;
    namePluralCapitalize: string;
    namePluralKebab: string;
}

interface ITemplate {
    content: string;
    name: string;
    extension: string;
}
