export class FilterValueConverter {
    toView(values: any[], filterBy) {
        return values.filter(filterBy);
    }
}

