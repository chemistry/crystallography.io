import { Client } from 'elasticsearch';

const ES_KEY = process.env.ES_KEY || '';
const client = new Client({
   host: 'http://search.crystallography.io',
   httpAuth: ES_KEY,
   apiVersion: '7.2',
});
// tslint:disable:no-console

// ping the client to be sure Elasticsearch is up
client.ping({
     requestTimeout: 30000,
 }, (error: any) => {
     if (error) {
         console.error('Elasticsearch cluster is down!');
     } else {
         console.log('Everything is ok');
     }
});


/*
    client.indices.delete({
        index: 'temp2_structures.documents'
    })
    .then((data)=> {
        console.log(JSON.stringify(data));
    });
*/

client.indices.create({
    index: 'temp3_structures.documents',
    "body": {
        "settings": {
            "analysis": {
                "analyzer": {
                    "indexing_analyzer": {
                        "tokenizer": "standard",
                        "filter": ["lowercase"]
                    }
                }
            }
        },
        "mappings":{
            "properties":{
                "mineral": {
                    "type": "text",
                    "analyzer":"indexing_analyzer",
                },
                "commonname": {
                    "type": "text",
                    "analyzer":"indexing_analyzer",
                },
                "chemname": {
                    "type": "text",
                    "analyzer":"indexing_analyzer",
                },
                "title": {
                    "type": "text",
                    "analyzer":"indexing_analyzer",
                }
            }
        }
    }
}, (error: any, response: any, status: any) => {
    console.log(status);
    console.log(response);

    if (error) {
        console.log(error);
    } else {
        console.log("created a new index", response);
    }
});


