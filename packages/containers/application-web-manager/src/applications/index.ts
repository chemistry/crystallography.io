import { getMolViewApplication } from "./molview";
import { getSearchApplication } from "./search";

export const Applications = {
    search: {
        version: "0.0.1",
        getApplication: getSearchApplication,
    },
    molview: {
        version: "0.0.1",
        getApplication: getMolViewApplication,
    },
};
