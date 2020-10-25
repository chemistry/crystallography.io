import {
    codSyncStartInstance
} from './index';

codSyncStartInstance({}, {} as any).then(data=> {
    // tslint:disable:no-console
    console.log(data);
})
