import * as path from 'path';
import * as fs  from 'fs';
import { ExecOptions, ShellString } from "shelljs";
import { Readable, Transform, TransformCallback, Writable } from "stream";

export interface AppContext {
  log: (message: string) => void;
  exec: (command: string, options?: ExecOptions & { async?: false }) => ShellString;
  execAsync: (command: string) => Readable;
  sendToQueue: (data: object) => void;
}

export interface CodFileRecord {
    fileName: string;
    codId: string;
}

const DATA_PATH = "/home/data/cif";
const FILE_REGEX  = /^\w{1}\s+(([\w\d.\/]+\/(\d+)\.cif))$/i;

let count = 0;
const extractDataFromLogs = new Transform({
    objectMode: true,
    transform: (chunk: Buffer, encoding: BufferEncoding, callback: TransformCallback) => {
        const lines = (chunk.toString('utf8'))
            .split("\n")
            .map((line) => {
                const matches = FILE_REGEX.exec(line);
                if (matches) {
                    return  {
                        fileName: path.resolve(DATA_PATH, matches[2]),
                        codId: matches[3],
                    };
                }
              })
              .filter((item) => {
                  return !!item;
            });
        count = count + lines.length;
        callback(null, lines);
    }
});

const getSendMessageToQueueStream = ({ sendToQueue }: AppContext)=> new Writable({
    objectMode: true,
    write: (chunk, _encoding, done) => {
        sendToQueue(chunk)
        done();
    }
});

const fetchDataFromCod = ({ log, execAsync }: AppContext): Readable => {
    const isFirstStart = !fs.existsSync(DATA_PATH);

    if (isFirstStart) {
        log('First start: initial fetching data...');
        return execAsync("svn co svn://www.crystallography.net/cod/cif " + DATA_PATH);
    }

    log('Update SVN data...');
    return execAsync("svn update " + DATA_PATH);
}

export const app = async(context: AppContext) => {
    const { log } = context;

    log('---------------------------------------------------');

    fetchDataFromCod(context)
       .pipe(extractDataFromLogs)
       .pipe(getSendMessageToQueueStream(context))
       .on('end', ()=> {
            log(`Fetch data finished ${count} items were updated`);
            log('---------------------------------------------------');
        });
}
