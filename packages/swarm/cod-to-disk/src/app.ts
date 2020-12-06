export interface AppContext {
  log: (message: string) => void;
  exec: (command: string) => { code: number };
}

export async function App(context: AppContext) {
    const { log, exec } = context;

    log("Synchronization cif form crystallography.net");

    exec("echo 'hello world' ");
    exec("sleep 50");
}
