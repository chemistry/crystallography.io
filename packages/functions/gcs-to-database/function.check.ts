import { getGCSAndStoreToDataBase } from "./index";

// tslint:disable-next-line
console.time("check");
(async () => {
    // Check event function
    await getGCSAndStoreToDataBase({
      name: "cif/4/06/02/4060224.cif",
    } as any);

})().then(() => {
    // tslint:disable-next-line
    console.timeEnd("check");
}).catch((e) => {
    // tslint:disable-next-line
    console.log(e);
});
