# @chemistry/containers-disk-to-db

Get information from database and store to MongoDB

## Commands
Build Container
```bash
cd ../../../ && docker build -t gcr.io/crystallography-api/containers-cod-to-disk -f packages/containers/disk-to-db/Dockerfile .
```

Execute container
```bash
docker run --rm --name cod-to-disk gcr.io/crystallography-api/containers-disk-to-db
```

Push container to GCP
```bash
# gcloud auth configure-docker
docker push gcr.io/crystallography-api/containers-disk-to-db
```

## Commands:
  * Build project: `npm run build`
