const structureCommonAttributes = [
    "a", "b", "c", "alpha", "beta", "gamma", "vol",
    "commonname", "chemname", "mineral", "formula", "calcformula",
    "__authors",
];

const structureCommonAttributesDetails = [
    "diffrtemp", "diffrpressure",
    "sg", "sgHall",
    "radType", "wavelength",
    "Rall", "Robs", "Rref", "wRall", "wRobs", "wRref",
    "loops",
];

const structureCommonCalcAttributes = [
    "title", "journal", "year", "volume", "issue", "firstpage", "lastpage", "doi",
];

export function getStructureAttributes(expand = false): string[] {
    let res = [
        ...structureCommonAttributes,
        ...structureCommonCalcAttributes,
    ];
    if (expand) {
        res = [
            ...res,
            ...structureCommonAttributesDetails,
        ];
    }

    return res;
}

export function mapStructure(expand = false) {
    const attributes = getStructureAttributes(expand);

    return (item: any) => {
        const itemFilted = attributes.reduce((acc: any, attr: string) => {
            if (item.hasOwnProperty(attr)) {
                acc[attr] = item[attr];
            }
            return acc;
        }, {} as any);

        if (Object.keys(item).length === 1) {
            return  {
                id: item._id,
                type: "structure",
                attributes: null,
            };
        }

        return {
            id: item._id,
            type: "structure",
            attributes: {
                ...itemFilted,
                id: item._id,
                articleHtml: getarticleHtml(item),
                loops: expand ? filterLoopArray(item.loops) : [],
            },
        };
    };
}

function filterLoopArray(loops: any) {
    if (!Array.isArray(loops)) {
        return [];
    }
    return loops.filter((item) => {
        return (item.columns.indexOf("_atom_site_fract_x") !== -1);
    });
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
