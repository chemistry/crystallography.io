import { useMongo } from './common/mongo';
import { Db } from 'mongodb';

export interface Context {
  db: Db;
  port: number;
}

const usePort = ()=> {
  const port = process.env.PORT;
  if (port && isFinite(parseInt(port, 10)) && parseInt(port, 10) > 0) {
      return parseInt(port, 10);
  }
  return 8080;
}

export const useContext = async ()=> {
  const { db } = await useMongo();
  const port = usePort();

  return {
    db, port
  }
}
