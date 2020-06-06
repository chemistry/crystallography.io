import { handler } from './index';

// tslint:disable-next-line

(async () => {
    // Check event function

    await new Promise((res)=> {
      setTimeout(res, 3000)
    });

    console.time("check");
    await handler({}, {} as any);
    console.timeEnd("check");

})().catch((e) => {
    // tslint:disable-next-line
    console.log(e);
});
