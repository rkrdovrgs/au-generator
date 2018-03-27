import { FrameworkConfiguration } from "aurelia-framework";
import * as _ from "lodash";

export function configure(config: FrameworkConfiguration) {
    let resources = {
        "value-converters": [
            "filter"
        ]
    };

    config.globalResources(_.flatMap(resources, (rs: string[], path: string) => {
        return rs.map(r => `./${path}/${r}`);
    }));
}
