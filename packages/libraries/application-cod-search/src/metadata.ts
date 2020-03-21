export const getAppInfo = () => {
  let appInfo = {};
  if (typeof require !== "undefined") {
      // tslint:disable-next-line
      appInfo =  eval("require")("./app.json");
  }
  return {
      id: "cod-search",
      path: "search",
      name: "applicaion-cod-search",
      description: "Cod Search Application",
      ...appInfo,
  };
};
