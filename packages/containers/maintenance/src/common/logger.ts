const path = require('path');
const fs = require('fs');
const { Logging } = require('@google-cloud/logging');

export const getPackageName = ()=> {
    const packagePath = path.resolve(__dirname, "../../package.json");
    const packageJSON = JSON.parse(fs.readFileSync(packagePath).toString());
    return (packageJSON.name || 'unknown').replace('@chemistry/','');
}

export const getLogger = async () => {
    const logging = new Logging();
    const log = logging.log(getPackageName());

    const metadata = {
        resource: { type: 'global' },
        severity: 'INFO',
    };

    let traceId = '';
    return {
        info: async (text: string)=> {
            const entry = log.entry(metadata, text);
            await log.write(entry);

            // tslint:disable-next-line
            console.log(text);
        },
        error: async (text: string) => {
            const entry = log.entry(metadata, text);
            await log.write({
                ...entry,
                severity: 'ERROR'
            });
            // tslint:disable-next-line
            console.log(text);
        },
        trace: async (text: string) => {
            const entry = log.entry(metadata, text);
            await log.write({
                ...entry,
                severity: 'NOTICE'
            });
            // tslint:disable-next-line
            console.log(text);
        },
        setTraceId: (id: string)=> {
            traceId = id;
        }
    }
}
