FROM otel/opentelemetry-collector-contrib:0.100.0

# Copy config into container
COPY otel-collector-config.yaml /etc/otel-collector-config.yaml

# Expose OTLP + metrics
EXPOSE 4317 4318 8889

# Start with baked config
CMD ["--config=/etc/otel-collector-config.yaml"]