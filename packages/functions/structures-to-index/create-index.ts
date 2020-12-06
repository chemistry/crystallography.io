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

client.indices.delete({
    index: 'structures'
})
.then((data)=> {
    console.log(JSON.stringify(data));
});

client.indices.create({
    index: 'structures',
    "body": {
        "settings": {
            "analysis": {
                "analyzer": {
                    "indexing_analyzer": {
                        "type": "custom",
                        "tokenizer": "standard",
                        "filter": ["lowercase"]
                    },
                    "standard_shingle": {
                        "type": "custom",
                        "tokenizer": "standard",
                        "filter": ["lowercase",  "my_shingle_filter"]
                    }
                },
                "filter": {
                    "my_shingle_filter": {
                        "type": "shingle",
                        "min_shingle_size": 2,
                        "max_shingle_size": 3,
                        "output_unigrams":"true"
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
                },
                "mineral_suggest": {
                    "type": "completion",
                    "analyzer": "standard_shingle",
                },
                "commonname_suggest": {
                    "type": "completion",
                    "analyzer": "standard_shingle",
                },
                "chemname_suggest": {
                    "type": "completion",
                    "analyzer": "standard_shingle",
                },
                "title_suggest": {
                    "type": "completion",
                    "analyzer": "standard_shingle",
                },
                "mineral_autocomplete": {
                    "type": "search_as_you_type",
                },
                "commonname_autocomplete": {
                    "type": "search_as_you_type",
                },
                "chemname_autocomplete": {
                    "type": "search_as_you_type",
                },
                "title_autocomplete": {
                    "type": "search_as_you_type",
                }
            }
        }
    }
}, (error: any, response: any, status: any) => {
    if (error) {
        console.error(error);
    } else {
        console.log("created a new index", response);
    }
});


