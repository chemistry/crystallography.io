const fieldsMaping = {
    "_cell_length_a": "a",
    "_cell_length_b": "b",
    "_cell_length_c": "c",
    "_cell_angle_alpha": "alpha",
    "_cell_angle_beta": "beta",
    "_cell_angle_gamma": "gamma",
    "_cell_volume": "vol",
    "_cell_formula_units_Z": "z",
    "_diffrn_ambient_temperature": "diffrtemp",
    "_diffrn_ambient_pressure": "diffrpressure",
    "_symmetry_space_group_name_H-M": "sg",
    "_symmetry_space_group_name_Hall": "sgHall",
    "_publ_section_title": "title",
    "_journal_name_full": "journal",
    "_journal_year": "year",
    "_journal_volume": "volume",
    "_journal_issue": "issue",
    "_journal_page_first": "firstpage",
    "_journal_page_last": "lastpage",
    "_journal_paper_doi": "doi",
    "_diffrn_radiation_type": "radType",
    "_diffrn_radiation_wavelength": "wavelength",
    "_chemical_name_common": "commonname",
    "_chemical_name_systematic": "chemname",
    "_chemical_name_mineral": "mineral",
    "_chemical_formula_moiety": "formula",
    "_chemical_formula_sum": "calcformula",
    "_chemical_formula_iupac": "iupacformula",
    "_refine_ls_R_factor_all": "Rall",
    "_refine_ls_R_factor_gt": "Robs",
    "_refine_ls_R_factor_ref": "Rref",
    "_refine_ls_wR_factor_all": "wRall",
    "_refine_ls_wR_factor_gt": "wRobs",
    "_refine_ls_wR_factor_ref": "wRref",
} as any;

const filterFields = Object.keys(fieldsMaping);

const loopFieldsFilter = [
    [
        "_publ_author_name",
    ],
    [
        "_symmetry_equiv_pos_as_xyz",
    ],
];

export function cleanupJCif(jcif: any): object {
    const result = {} as any;

    filterFields.forEach((fieldName) => {
        if (jcif.hasOwnProperty(fieldName)) {
            result[fieldsMaping[fieldName]] = jcif[fieldName];
        }
    });

    setupLoopFields(result, jcif);

    return result;
}

function constructFilterFunction(loopFieldsFilterList: any) {
    return (loopItem: any) => {
        const columns = loopItem.columns || [];
        return loopFieldsFilterList.some((fieldsArray: any) => {
            return columns.some((col: any) => {
                return fieldsArray.indexOf(col) !== -1;
            });
        });
    };
}

const coordFields = [
    "_atom_site_fract_x",
    "_atom_site_fract_y",
    "_atom_site_fract_z",
];

const coordFieldsOrder = [
    "_atom_site_label",
    "_atom_site_type_symbol",
    "_atom_site_fract_x",
    "_atom_site_fract_y",
    "_atom_site_fract_z",
    "_atom_site_U_iso_or_equiv",
    "_atom_site_occupancy",
    "_atom_site_disorder_assembly",
    "_atom_site_disorder_group",
];

function prepareCoordLoop(coordLoop: any) {
    const colsIdx = coordFieldsOrder.map((colName) => {
        return {
            name: colName,
            idx: coordLoop.columns.indexOf(colName),
        };
    })
    // filter non existing
        .filter((item) => {
            return item.idx !== -1;
        });

    const newColNames = colsIdx.map((item) => {
        return item.name;
    });

    const dataIndexes = colsIdx.map((item) => {
        return item.idx;
    });

    const newData = (coordLoop.data || []).map((row: any) => {
        return dataIndexes.map((colIdx) => {
            return row[colIdx];
        });
    });

    return {
        columns: newColNames,
        data: newData,
    };
}

function strLoops(loops: any) {
  return {
    columns: loops.columns,
    data: loops.data,
  };
}

function setupLoopFields(result: any, fields: any) {
    const loopFilter = constructFilterFunction(loopFieldsFilter);
    const loopFields = (fields.loop_ || []).filter(loopFilter);

    // get coordinates loop
    const coordLoopFilter = constructFilterFunction([coordFields]);
    const coordLoop = (fields.loop_ || []).filter(coordLoopFilter);
    if (coordLoop.length === 1) {
        const newCoordLoop = prepareCoordLoop(coordLoop[0]);
        loopFields.push(newCoordLoop);
    } else {
        // tslint:disable-next-line
        console.error("COORD LOOP NOT FOUND", fields._cod_database_code);
    }

    result.loops = (loopFields || []).map(strLoops);
}
