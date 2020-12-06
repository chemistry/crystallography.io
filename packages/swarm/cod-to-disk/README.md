# @chemistry/containers-cod-to-disk

Container to store COD content to disk

## Commands
Build Container
```bash
cd ../../../ && docker build -t gcr.io/crystallography-api/containers-cod-to-disk -f packages/swarm/cod-to-disk/Dockerfile .
```

Execute container
```bash
docker run --rm --name cod-to-disk gcr.io/crystallography-api/containers-cod-to-disk
```

Push container to GCP
```bash
# gcloud auth configure-docker
docker push gcr.io/crystallography-api/containers-cod-to-disk
```

## Commands:
  * Build project: `npm run build`
