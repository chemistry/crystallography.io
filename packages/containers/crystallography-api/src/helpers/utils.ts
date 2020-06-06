const structureCommonAttributes = [
    "a", "b", "c", "alpha", "beta", "gamma", "vol",
    "commonname", "chemname", "mineral", "formula", "calcformula",
    "__authors",
];

const structureCommonCalcAttributes = [
    "title", "journal", "year", "volume", "issue", "firstpage", "lastpage", "doi",
];

export function getStructureAttributes(): string[] {
    return [
        ...structureCommonAttributes,
        ...structureCommonCalcAttributes,
    ];
}

export function mapStructure() {
    const attributes = getStructureAttributes();

    return (item: any) => {
        const itemFilted = attributes.reduce((acc: any, attr: string) => {
            if (item.hasOwnProperty(attr)) {
                acc[attr] = item[attr];
            }
            return acc;
        }, {} as any);

        if (Object.keys(item).length === 1) {
            return  {
                id: item.id,
                type: "structure",
                attributes: null,
            };
        }

        return {
            id: item.id,
            type: "structure",
            attributes: {
                ...itemFilted,
                id: item.id,
                articleHtml: getarticleHtml(item),
                loops: [],
            },
        };
    };
}

function getarticleHtml(item: any): string {
    if (item.journal || item.year) {
        const nameTags = [];

        if (item.journal) {
            nameTags.push("<i>" + item.journal + "</i>");
        }

        if (item.year) {
            nameTags.push("(<b>" + item.year + "</b>)");
        }

        if (item.volume) {
            nameTags.push(item.volume + ",");
        }

        if (item.issue) {
            nameTags.push(item.issue);
        }

        if (item.firstpage || item.lastpage) {
            let f = item.firstpage || "";
            if (item.lastpage) {
                f += "-" + item.lastpage;
            }
            nameTags.push(f);
        }

        return nameTags.join(" ");
    }

    return "";
}
