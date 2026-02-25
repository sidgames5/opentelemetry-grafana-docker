FROM prom/prometheus

# Add your prometheus config
ADD prometheus.yml /etc/prometheus/

# Enable remote write receiver
CMD [ "--config.file=/etc/prometheus/prometheus.yml", "--web.enable-remote-write-receiver" ]