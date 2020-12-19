# @chemistry/scheduler

Scheduler - schedule regular work, by sending messages to event queue

## Commands

Build Container
```bash
cd ../../../ && docker build -t gcr.io/crystallography-api/containers-scheduler -f packages/swarm/scheduler/Dockerfile .
```

Execute container
```bash
docker run --rm -e GCP_SA_KEY="..." --name scheduler gcr.io/crystallography-api/containers-scheduler
```

Build and Run container
```bash
cd ../../../ && docker build -t gcr.io/crystallography-api/containers-scheduler -f packages/swarm/scheduler/Dockerfile . && cd packages/swarm/scheduler/ && docker run --rm -e GCP_SA_KEY=$GCP_SA_KEY --name scheduler gcr.io/crystallography-api/containers-scheduler
```

Push container
```bash
# gcloud auth configure-docker
docker push gcr.io/crystallography-api/containers-cod-to-gcs-sync
```

Prepare $GCP_SA_KEY env varible
```
cat credentials.json | base64 >> credentials.base64.json
```

Setting environment variable
```
GCP_SA_KEY=$(cat credentials.json | base64) &&  echo $GCP_SA_KEY
```


## Commands:
  * Build project: `npm run build`
