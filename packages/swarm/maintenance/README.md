# @chemistry/maintenance

Set of maintenance tasks scheduled regularly (e.g. index recalculation)

## Commands
Build Container
```bash
cd ../../../ && docker build -t gcr.io/crystallography-io/maintenance -f packages/swarm/maintenance/Dockerfile .
```

Execute container
```bash
docker run --rm --name cod-to-disk gcr.io/crystallography-io/maintenance
```

Push container to GCP
```bash
# gcloud auth configure-docker
docker push gcr.io/crystallography-io/maintenance
```

## Commands:
  * Build project: `npm run build`
