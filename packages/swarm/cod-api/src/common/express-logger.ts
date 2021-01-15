const path = require('path');
const fs = require('fs');
const lb = require('@google-cloud/logging-bunyan');

export const getPackageName = ()=> {
    const packagePath = path.resolve(__dirname, "../../package.json");
    const packageJSON = JSON.parse(fs.readFileSync(packagePath).toString());
    return (packageJSON.name || 'unknown').replace('@chemistry/','');
}

export const getLogger = async ()=> {
    const {logger, mw} = await lb.express.middleware({
        logName: getPackageName(),
    });

    return {
        logger, mw
    }
}
