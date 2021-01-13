const path = require('path');
const fs = require('fs');
const { Logging } = require('@google-cloud/logging');

export const getPackageName = ()=> {
    const packagePath = path.resolve(__dirname, "../../package.json");
    const packageJSON = JSON.parse(fs.readFileSync(packagePath).toString());
    return (packageJSON.name || 'unknown').replace('@chemistry/','');
}

export const getLogger = async ()=> {
    const logging = new Logging();
    const log = logging.log({
        logName: getPackageName()
    });

    const metadata = {
        resource: { type: 'global' },
        severity: 'INFO',
    };

    return {
        log: async (text: string) => {
            const entry = log.entry(metadata, text);
            await log.write(entry);
            // tslint:disable-next-line
            console.log(text);
        }
    }
}
