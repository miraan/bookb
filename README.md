GCloud:

```
gcloud compute --project "third-camera-241015" ssh --zone "europe-west2-c" "instance-1"
```

Install certificates:

```
sudo certbot certonly --webroot -w /var/www/bookb/build/client -d bookb.co -d www.bookb.co
```

Congratulations! Your certificate and chain have been saved at:
   /etc/letsencrypt/live/bookb.co/fullchain.pem
   Your key file has been saved at:
   /etc/letsencrypt/live/bookb.co/privkey.pem


Set up crontab to renew the certificates automatically:

```
crontab -e
```

Then add the line:

```
0 0 1 * * sudo certbot renew >> /logs/certbot.log >/dev/null 2>&1
```
