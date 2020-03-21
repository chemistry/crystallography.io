import { getApplication } from "@chemistry/application-cod-search";
import { getLayout } from "../layout";

export const getAppManager = ({ url }: { url: string }): any => {
    return {
      getApplication,
      getLayout,
    };
};
