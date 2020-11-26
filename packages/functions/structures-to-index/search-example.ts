import { Client } from 'elasticsearch';
const client = new Client({
   hosts: [ 'http://elasticsearch.crystallography.io' ],
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

// Add document to index
/*
client.index({
    id: '1000000',
    index: 'structures.data',
    type: '_doc',
    body: {
        a: "9.73970",
        alpha: "90.00000",
        b: "8.91740",
        beta: "105.86600",
        c: "5.25030",
        calcformula: "Ca Mg O6 Si2",
        diffrpressure: "100",
        doi: "10.2138/am.2008.2684",
        firstpage: "177",
        gamma: "90.00000",
        journal: "American Mineralogist",
        lastpage: "186",
        mineral: "Diopside",
        sg: "C 1 2/c 1",
        sgHall: "-C 2yc",
        title: "The crystal structure of diopside at pressure to 10 GPa Locality: DeKalb, New York Sample: P = 1 atm",
        volume: "93",
        year: "2008"

    }
}, (err: any, resp: any) =>{
    console.log(err);
    console.log(resp);
});
*/

// Document search example
client.search({
    index: 'structures.documents',
    body: {
        query: {
            "multi_match": {
                "query": 'diopside',
                "fields": [
                    'commonname^4', 'mineral^4', 'chemname^4', 'title'
                ]
            }
        }
    }
})
.then((data)=> {
    console.log(JSON.stringify(data));
});

// Autocomplete example
/*
client.search({
    index: 'structures.documents',
    body: {
        "query": {
            "multi_match": {
              "query": "nap",
              "type": "bool_prefix",
              "fields": [
                'commonname', 'mineral', 'chemname', 'title'
              ]
            }
        }
    }
})
.then((data)=> {
    console.log(JSON.stringify(data));
});
*/
