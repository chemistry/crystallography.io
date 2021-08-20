import { MongoClient } from "mongodb";

export const useMongo = async () => {
    const {
      MONGO_CONNECTION
    }  = process.env;

    const start = new Date().getTime();

    const mongoClient = await MongoClient.connect(MONGO_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const end = new Date().getTime();

   // tslint:disable-next-line
   console.log(`Connected to MongoDB in ${end - start} ms`);

    const close = ()=> {
      return mongoClient.close();
    }
    const db = mongoClient.db("crystallography");

    process.on('SIGTERM', () => {
      mongoClient.close();
    });

    return { db, close };
}
