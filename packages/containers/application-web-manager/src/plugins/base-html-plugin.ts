import { PlatfomContext, Plugin } from "../interfaces";

const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1" />
    <meta name="description" content="" />
    <title>Chemical Applications</title>
</head>
<body>
    <div id="app"></div>
</body>
</html>`;

export const baseHTMLPlugin: Plugin = {
    async initialize(context: PlatfomContext) {
        const middleWare: any = async (data: any) => {
            return {
              ...data,
              html,
            };
        };

        context.addMiddleWare({
            order: 30,
            middleWare,
        });
    },
};
