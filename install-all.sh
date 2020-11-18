
export $(egrep -v '^#' .env | xargs)

sudo apt-get update

#install redis-server
sudo apt-get install redis-server -y
sudo service redis-server start

#install mongo
curl -fsSL https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
sudo apt-get update
sudo apt-get install mongodb-org -y
sudo systemctl start mongod.service
chown -R mongodb:mongodb /var/lib/mongodb
chown mongodb:mongodb /tmp/mongodb-27017.sock
sudo service mongod restart
sudo systemctl status mongod
sudo systemctl enable mongod

#create mongo database for explorer.
mongo <<EOF
use $MONGODB_DATABASE
db.createUser({
  user:  '$MONGODB_USERNAME',
  pwd: '$MONGODB_PASSWORD',
  roles: [{
    role: 'readWrite',
    db: '$MONGODB_DATABASE'
  }]
})
EOF

#install wagerrd

# Download latest node and install.
echo 'Installing wagerr'

wgrlink=`curl -s https://api.github.com/repos/wagerr/wagerr/releases | grep browser_download_url | grep x86_64-linux-gnu.tar.gz | cut -d '"' -f 4`
mkdir -p /tmp/wagerr
cd /tmp/wagerr
curl -Lo wagerr.tar.gz $wgrlink
tar -xvf wagerr.tar.gz
wgrfolder=`ls | grep wagerr-`
cd /tmp/wagerr/$wgrfolder
mv ./bin/* /usr/local/bin
cd
rm -rf /tmp/wagerr

echo 'creating wagerr config'

echo "User: $RPC_USER"
echo "Pass: $RPC_PASS"
sleep 1s
if [ -z "$RPC_USER" ] || [ -z "$RPC_PASS" ]
then
  echo "node: RPC_USER or RPC_PASS not provided!"
  printenv
  exit 1
fi

# Setup configuration for node.
rpcuser=$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 13 ; echo '')
rpcpassword=$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 32 ; echo '')
cat > ~/.wagerr/wagerr.conf <<EOL
daemon=1
txindex=1
enablezeromint=0
server=1
rpcbind=0.0.0.0
rpcallowip=0.0.0.0/0
rpcuser=$RPC_USER
rpcpassword=$RPC_PASS
rpcclienttimeout=30
rpcport=$RPC_PORT
testnet=$COIN_TESTNET
staking=0
debug=1
EOL

echo 'RPC configuration has been applied'
cat ~/.wagerr/wagerr.conf

echo 'starting daemon'
wagerrd -daemon



#install explorer

apt-get install -y cron bash curl nodejs git

git clone https://github.com/frndxyz/wagerr-explorer.git

cd wagerr-explorer
git checkout $GIT_BRANCH

cat > ./config.js <<EOL
const config = {
  api: {
    host: '$API_SERVER',
    port: '$SERVER_API_PORT' || '8087',
    prefix: '/api',
    timeout: '30s'
  },
  coinMarketCap: {
    tickerId: '1779'
  },
  db: {
    host: '$MONGODB_HOST' || 'mongo',
    port: '$MONGODB_PORT' || '27017',
    name: '$MONGODB_DATABASE' || 'wagerrx',
    user: '$MONGODB_USERNAME' || 'wagerru',
    pass: '$MONGODB_PASSWORD' || 'wagerrpass2019'
  },
  freegeoip: {
    api: 'https://extreme-ip-lookup.com/json/'
  },
  faucet:{
    wait_time: 1440,
    percent: 0.02,
    limit: 500
  },
  rpc: {
    host: '$RPC_BIND' || 'rpcnode',
    port: '$RPC_PORT' || 8332,
    user: '$RPC_USER' || 'wagerr',
    pass: '$RPC_PASS' || 'thiswagerrpass',
    timeout: 8000, // 8 seconds
  },
  coin:{
    testnet: 'MainNet' || 'MainNet',
    oracle_payout_address: '$ORACLE_PAYOUT_ADDRESS' || 'TGFKr64W3tTMLZrKBhMAou9wnQmdNMrSG2', // testnet address, replace with mainnet
    dev_payout_address: '$DEV_PAYOUT_ADDRESS' || 'TLceyDrdPLBu8DK6UZjKu4vCDUQBGPybcY', // testnet address, replace with mainnet
  },
  redis:{
    host: '$REDIS_HOST' || 'localhost',
  },
  crons: {
    start: '$START_HEIGHT',
  },
};

module.exports = config;
EOL

npm install -g yarn
yarn install
yarn run build 

#install crontab
crontab crontab.txt

#setup nginx
sudo apt install nginx

cat > /etc/nginx/sites-available/wagerr_explorer <<EOL 
server {

    server_name 95.217.8.192;
    listen 80;
    listen [::]:80;

    location ~ /.well-known {
                allow all;
        }
    location / {
        proxy_pass http://0.0.0.0:8087;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        }
}
EOL

sudo ln -s /etc/nginx/sites-available/wagerr_explorer /etc/nginx/sites-enabled/
sudo systemctl restart nginx

yarn run start:api 
yarn run start:web