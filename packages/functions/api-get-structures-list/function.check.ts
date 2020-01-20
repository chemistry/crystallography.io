import { handler } from './index';
class mockRes {
    public status(stat: number) {
      console.log(stat);
      return this;
    }
    public json(content: any) {
      console.log(content);
      return this;
    }
    public send(content: string) {
      console.log(content);
      return this;
    }
}

// tslint:disable-next-line

(async () => {
    // Check event function
    const res: any = new mockRes();

    await new Promise((res)=> {
      setTimeout(res, 3000)
    });

    console.time("check");
    await handler({ query: { page: 1} } as any, res);
    console.timeEnd("check");
})().catch((e) => {
    // tslint:disable-next-line
    console.log(e);
});
