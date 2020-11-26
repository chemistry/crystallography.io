import { Client } from 'elasticsearch';
const client = new Client({
   hosts: [ 'http://elasticsearch.crystallography.io'],
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


client.indices.delete({
    index: 'structures.documents'
})
.then((data)=> {
    console.log(JSON.stringify(data));
});

client.indices.create({
    index: 'structures.documents',
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


