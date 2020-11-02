import { Client } from 'elasticsearch';
const client = new Client({
   hosts: [ 'http://elasticsearch.crystallography.io']
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

client.indices.create({
    index: 'structures.documents',
    "body": {
        "settings": {
            "analysis": {
                "analyzer": {
                    "indexing_analyzer": {
                        "tokenizer": "whitespace",
                        "filter":  ["lowercase", "edge_ngram_filter"]
                    },
                    "search_analyze": {
                        "tokenizer": "whitespace",
                        "filter":  "lowercase"
                    }
            },
            "filter": {
                    "edge_ngram_filter": {
                        "type": "edge_ngram",
                        "min_gram": 1,
                        "max_gram": 20
                    }
                }
            }
        },
        "mappings":{
            "properties":{
                "mineral": {
                    "type": "text",
                    "analyzer":"indexing_analyzer",
                    "search_analyzer": "search_analyze"
                },
                "commonname": {
                    "type": "text",
                    "analyzer":"indexing_analyzer",
                    "search_analyzer": "search_analyze"
                },
                "chemname": {
                    "type": "text",
                    "analyzer":"indexing_analyzer",
                    "search_analyzer": "search_analyze"
                },
                "title": {
                    "type": "text",
                    "analyzer":"indexing_analyzer",
                    "search_analyzer": "search_analyze"
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
})


