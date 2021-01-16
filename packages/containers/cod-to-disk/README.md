# @chemistry/cod-to-disk

Synchronize information from COD database and store to disk

## Commands
Build Container
```bash
cd ../../../ && docker build -t gcr.io/crystallography-api/cod-to-disk -f packages/containers/cod-to-disk/Dockerfile .
```

Execute container
```bash
docker run --rm --name cod-to-disk gcr.io/crystallography-api/cod-to-disk
```

Push container to GCP
```bash
# gcloud auth configure-docker
docker push gcr.io/crystallography-api/cod-to-disk
```

## Commands:
  * Build project: `npm run build`
