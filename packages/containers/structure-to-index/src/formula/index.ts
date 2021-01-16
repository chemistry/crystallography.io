import { Collection } from "mongodb";
import { AppContext } from "../app";

export const processFormulaIndex = async ({ structureId, context }: { structureId: number, context: AppContext}) => {
    const { logger, db } = context;

    const structureDB = db.collection("structures");
    const formulasDB = db.collection("formulas");
    const doc = await structureDB.findOne({ _id: structureId })
    if (!doc) {
        return;
    }

    const formula = parseFormula(doc.calcformula);
    if (!Object.keys(formula).length) {
        // tslint:disable-next-line
        console.log("unprocessed formula", formula, doc._id);
        return;
    }

    await clearDocLinks(formulasDB, doc._id);
    await processFormula(formulasDB, formula, doc._id);

    await ensureFormulasDBIndexes(formulasDB);
}

async function processFormula(formulasDB: Collection, formula: any, docId: number) {
    const where = {
        ...formula,
        elements: Object.keys(formula).length,
    };

    const record = await formulasDB.findOne(where);

    if (record) {
        const structures = record.structures.slice(0);
        structures.push(docId);
        await formulasDB.updateOne({
              _id: record._id,
        }, {
              $set: {
                count : structures.length,
                structures,
              },
        });
    } else {
        await formulasDB.insertOne({
            ...where,
            count: 1,
            structures: [docId],
        });
    }
}

async function clearDocLinks(formulasDB: Collection, docId: number) {

    const recordsList = await formulasDB.find({
        structures: docId
    }).toArray();

    const promises = recordsList.map(async (record) => {
        const index = record.structures.indexOf(docId);
        record.structures.splice(index, 1);

        const structuresCount = record.structures.length;
        if (structuresCount === 0) {
            await formulasDB.deleteOne({
                _id: record._id,
            });
        } else {
            record.count = structuresCount;
            await formulasDB.updateOne({
                _id: record._id,
            }, {
                $set: {
                    structures: record.structures.slice(0),
                    count : structuresCount,
                },
            });
        }
    });

    await Promise.all(promises);
}

function parseFormula(formula: string) {
    // tslint:disable-next-line
    const s1Item = /(He|Li|Be|Ne|Na|Mg|Al|Si|Cl|Ar|Ca|Sc|Ti|Cr|Mn|Fe|Co|Ni|Cu|Zn|Ga|Ge|As|Se|Br|Kr|Rb|Sr|Zr|Nb|Mo|Tc|Ru|Rh|Pd|Ag|Cd|In|Sn|Sb|Te|Xe|Cs|Ba|La|Ce|Pr|Nd|Pm|Sm|Eu|Gd|Tb|Dy|Ho|Er|Tm|Yb|Lu|Hf|Ta|Re|Os|Ir|Pt|Au|Hg|Tl|Pb|Bi|Po|At|Rn|Fr|Ra|Ac|Th|Pa|Np|Pu|Am|Cm|Bk|Cf|Es|Fm|Md|No|Lr|Rf|Db|Sg|Bh|Hs|Mt|Ds|Rg|Cn|Q|H|D|B|C|N|O|F|P|S|K|V|Y|I|W|U){1,1}([.0-9]{0,10})/g;
    let found;
    const formulaObj: any = {};

    // tslint:disable-next-line
    while ((found = s1Item.exec(formula))) {
        const element = found[1];
        const count = (found[2] === "") ? '1' : found[2];

          // element exists ?
        if (formulaObj[element]) {
            formulaObj[element] = parseFloat(formulaObj[element]) + parseFloat(count);
        } else {
            formulaObj[element] = parseFloat(count);
        }
    }
    return formulaObj;
}

async function ensureFormulasDBIndexes(formulasDB: Collection) {
    await formulasDB.createIndex({ elements: 1, count: -1 });
    await formulasDB.createIndex({ C: 1, H: 1, elements: 1, count: -1 });
    await formulasDB.createIndex({ He: 1, count: -1 });
    await formulasDB.createIndex({ Li: 1, count: -1 });
    await formulasDB.createIndex({ Na: 1, count: -1 });
    await formulasDB.createIndex({ Si: 1, count: -1 });
    await formulasDB.createIndex({ Cl: 1, count: -1 });
    await formulasDB.createIndex({ Br: 1, count: -1 });
    await formulasDB.createIndex({ Q: 1, count: -1 });
    await formulasDB.createIndex({ H: 1, count: -1 });
    await formulasDB.createIndex({ D: 1, count: -1 });
    await formulasDB.createIndex({ B: 1, count: -1 });
    await formulasDB.createIndex({ C: 1, count: -1 });
    await formulasDB.createIndex({ O: 1, count: -1 });
    await formulasDB.createIndex({ N: 1, count: -1 });
    await formulasDB.createIndex({ F: 1, count: -1 });
    await formulasDB.createIndex({ P: 1, count: -1 });
    await formulasDB.createIndex({ S: 1, count: -1 });
    await formulasDB.createIndex({ K: 1, count: -1 });
    await formulasDB.createIndex({ V: 1, count: -1 });
    await formulasDB.createIndex({ Y: 1, count: -1 });
    await formulasDB.createIndex({ I: 1, count: -1 });
    await formulasDB.createIndex({ W: 1, count: -1 });
    await formulasDB.createIndex({ U: 1, count: -1 });
    await formulasDB.createIndex({ structures: 1 });
}
