# Setup Swarm Cluster

## Infrastructure Setup include following items
  * 1. Setup Swarm Cluster (Cluster Itself)
  * 2. Traefik (http/https proxy)
  * 3. Swarmpit (cluster management software - optional)
  * 4. Jaeger (cluster Logging)

### Useful Links:
  * [dockerswarm.rocks](https://dockerswarm.rocks/)
  * [swarmpit](https://swarmpit.io/)
  * [jaeger](https://www.jaegertracing.io/)

### 1. Setup Swarm Cluster
```bash
# Set up the server hostname
export USE_HOSTNAME=host.crystallography.io
echo $USE_HOSTNAME > /etc/hostname
hostname -F /etc/hostname

# Install the latest updates
apt-get update
apt-get upgrade -y

# Download Docker
curl -fsSL get.docker.com -o get-docker.sh

# Install Docker using the stable channel (instead of the default "edge")
CHANNEL=stable sh get-docker.sh

# Remove Docker install script
rm get-docker.sh

# To add additional machines:
docker swarm join --token _______________ ___.___.___.___:2377

docker swarm init --advertise-addr ___.___.___.___
```

### 2. Traefik Proxy with HTTPS
```bash
# Create network
docker network create --driver=overlay traefik-public
export NODE_ID=$(docker info -f '{{.Swarm.NodeID}}')

docker node update --label-add traefik-public.traefik-public-certificates=true $NODE_ID

# Setup Environment Variables
export EMAIL=______
export DOMAIN=______
export USERNAME=______
export PASSWORD=______
export HASHED_PASSWORD=$(openssl passwd -apr1 $PASSWORD)

# Install traefik stack
curl -L dockerswarm.rocks/traefik-host.yml -o traefik-host.yml
docker stack deploy -c traefik-host.yml traefik
docker stack ps traefik
docker service logs traefik_traefik
```

### 3. Install swarmpit
```bash
export DOMAIN=______
export NODE_ID=$(docker info -f '{{.Swarm.NodeID}}')
docker node update --label-add swarmpit.db-data=true $NODE_ID
docker node update --label-add swarmpit.influx-data=true $NODE_ID
curl -L dockerswarm.rocks/swarmpit.yml -o swarmpit.yml
docker stack deploy -c swarmpit.yml swarmpit
docker stack ps swarmpit
```

### 4. Installing Jaeger
```bash
# https://www.jaegertracing.io/docs/1.21/

```




