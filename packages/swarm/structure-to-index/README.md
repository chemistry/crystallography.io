# @chemistry/containers-structure-to-index

Triggered on structure change - update all required indexes

## Commands
Build Container
```bash
cd ../../../ && docker build -t gcr.io/crystallography-api/containers-structure-to-index -f packages/swarm/structure-to-index/Dockerfile .
```

Execute container
```bash
docker run --rm --name cod-to-disk gcr.io/crystallography-api/containers-structure-to-index
```

Push container to GCP
```bash
# gcloud auth configure-docker
docker push gcr.io/crystallography-api/containers-structure-to-index
```

## Commands:
  * Build project: `npm run build`
