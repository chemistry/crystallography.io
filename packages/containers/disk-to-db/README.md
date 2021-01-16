# @chemistry/disk-to-db

Get updated structures from disk and store to MongoDB database

## Commands
Build Container
```bash
cd ../../../ && docker build -t gcr.io/crystallography-api/cod-to-disk -f packages/containers/disk-to-db/Dockerfile .
```

Execute container
```bash
docker run --rm --name cod-to-disk gcr.io/crystallography-api/disk-to-db
```

Push container to GCP
```bash
# gcloud auth configure-docker
docker push gcr.io/crystallography-api/disk-to-db
```

## Commands:
  * Build project: `npm run build`
