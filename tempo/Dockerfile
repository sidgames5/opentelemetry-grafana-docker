FROM grafana/tempo:2.5.0

# Create required directories
RUN mkdir -p /var/tempo/traces
RUN chmod -R 777 /var/tempo

# Copy config into image
COPY tempo.yaml /etc/tempo.yaml

# Expose Tempo HTTP + gRPC
EXPOSE 3200 9095

# Explicitly start with config
CMD ["-config.file=/etc/tempo.yaml"]