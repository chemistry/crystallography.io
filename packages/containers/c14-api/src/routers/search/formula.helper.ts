// tslint:disable-next-line
const ELEMENTS = ["Li", "Be", "Ne", "Na", "Mg", "Al", "Si", "Cl", "Ar", "Ca", "Sc", "Ti", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn", "Ga", "Ge", "As", "Se", "Br", "Kr", "Rb", "Sr", "Zr", "Nb", "Mo", "Tc", "Ru", "Rh", "Pd", "Ag", "Cd", "In", "Sn", "Sb", "Te", "Xe", "Cs", "Ba", "La", "Ce", "Pr", "Nd", "Pm", "Sm", "Eu", "Gd", "Tb", "Dy", "Ho", "Er", "Tm", "Yb", "Lu", "Hf", "Ta", "Re", "Os", "Ir", "Pt", "Au", "Hg", "Tl", "Pb", "Bi", "Po", "At", "Rn", "Fr", "Ra", "Ac", "Th", "Pa", "Np", "Pu", "Am", "Cm", "Bk", "Cf", "Es", "Fm", "Md", "No", "Lr", "Rf", "Db", "Sg", "Bh", "Hs", "Mt", "Ds", "Rg", "Cn", "Q", "H", "D", "B", "C", "N", "O", "F", "P", "S", "K", "V", "Y", "I", "W", "U"];
// tslint:disable-next-line
const FORMULA_QUERY_REGEX = /(He|Li|Be|Ne|Na|Mg|Al|Si|Cl|Ar|Ca|Sc|Ti|Cr|Mn|Fe|Co|Ni|Cu|Zn|Ga|Ge|As|Se|Br|Kr|Rb|Sr|Zr|Nb|Mo|Tc|Ru|Rh|Pd|Ag|Cd|In|Sn|Sb|Te|Xe|Cs|Ba|La|Ce|Pr|Nd|Pm|Sm|Eu|Gd|Tb|Dy|Ho|Er|Tm|Yb|Lu|Hf|Ta|Re|Os|Ir|Pt|Au|Hg|Tl|Pb|Bi|Po|At|Rn|Fr|Ra|Ac|Th|Pa|Np|Pu|Am|Cm|Bk|Cf|Es|Fm|Md|No|Lr|Rf|Db|Sg|Bh|Hs|Mt|Ds|Rg|Cn|Q|H|D|B|C|N|O|F|P|S|K|V|Y|I|W|U){1,1}([*0-9]{0,20})/g;
// tslint:disable-next-line
const FORMULA_QUERY_REGEX_S = /^(((He|Li|Be|Ne|Na|Mg|Al|Si|Cl|Ar|Ca|Sc|Ti|Cr|Mn|Fe|Co|Ni|Cu|Zn|Ga|Ge|As|Se|Br|Kr|Rb|Sr|Zr|Nb|Mo|Tc|Ru|Rh|Pd|Ag|Cd|In|Sn|Sb|Te|Xe|Cs|Ba|La|Ce|Pr|Nd|Pm|Sm|Eu|Gd|Tb|Dy|Ho|Er|Tm|Yb|Lu|Hf|Ta|Re|Os|Ir|Pt|Au|Hg|Tl|Pb|Bi|Po|At|Rn|Fr|Ra|Ac|Th|Pa|Np|Pu|Am|Cm|Bk|Cf|Es|Fm|Md|No|Lr|Rf|Db|Sg|Bh|Hs|Mt|Ds|Rg|Cn|Q|H|D|B|C|N|O|F|P|S|K|V|Y|I|W|U){1,1}([*0-9]{0,20}))+)$/g;

export function isValidFormula(formula: string): boolean  {
    return !!formula.match(FORMULA_QUERY_REGEX);
}

export function isValidFormulaStrict(formula: string): boolean {
    return !!formula.match(FORMULA_QUERY_REGEX_S);
}

export function validElements(formula: string): any {
    FORMULA_QUERY_REGEX.lastIndex = 0;
    let foundIndex = 0;
    while ((FORMULA_QUERY_REGEX.exec(formula))) {
        foundIndex++;
    }

    return foundIndex;
}

export function parseFormula(formulaStr: string, autoCompleteMode: boolean): any {
    let found;
    const formulaObj: any = {};

    FORMULA_QUERY_REGEX.lastIndex = 0;

    let lastFound = null;
    // tslint:disable-next-line
    while ((found = FORMULA_QUERY_REGEX.exec(formulaStr))) {
        const element = found[1];
        const count = (found[2] === "") ? 1 : found[2];
        lastFound = found;

        // element exists ?
        if (formulaObj[element]) {
            if (formulaObj[element] === "*" || count === "*") {
                formulaObj[element] = "*";
            } else {
                formulaObj[element] = parseFloat(formulaObj[element]) + parseFloat(count as any);
            }
        } else {
            formulaObj[element] = parseFloat(count as any);
        }
    }

    if (autoCompleteMode && lastFound) {
        const element = lastFound[1];
        const counter = lastFound[2];
        if (element && counter === "" && formulaObj[element] === 1) {
            formulaObj[element] = "*";
        }
    }

    return formulaObj;
}

function elementCompare(a: string, b: string) {
    if (a === "C" || a === "H" || b === "C" || b === "H") {
        const a1 = ["H", "C"].indexOf(a); // C => 2, H=> 1, ? =>-1
        const b1 = ["H", "C"].indexOf(b); // C => 2, H=> 1, ? =>-1

        if (a1 === b1) {
            return 0;
        }
        return (a1 > b1) ? -1 : 1;
    }

    if (a === b) {
        return 0;
    }
    return (a < b) ? -1 : 1;
}

export function formulaToString(formulaObj: any): string {
    const formulaDataArray = Object.keys(formulaObj)
        .filter((key) => {
            return ELEMENTS.indexOf(key) !== -1;
        })
        .map((key) => {
            return {
                element: key,
                count: formulaObj[key],
            };
        });

    // sorted formula
    formulaDataArray.sort((a, b) => {
        return elementCompare(a.element, b.element);
    });

    return formulaDataArray.map((item) => {
        return item.element + ((item.count === 1) ? "" : item.count);
    }).join("");
}
