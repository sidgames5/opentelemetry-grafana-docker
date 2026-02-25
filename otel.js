import { NodeSDK } from '@opentelemetry/sdk-node'
import { Resource } from '@opentelemetry/resources'
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { LoggerProvider, BatchLogRecordProcessor } from '@opentelemetry/sdk-logs'
import { logs } from '@opentelemetry/api-logs'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'

const endpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318'

const resource = new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: process.env.OTEL_SERVICE_NAME || 'dummy',
    [SemanticResourceAttributes.SERVICE_VERSION]: process.env.npm_package_version || '1.0.0',
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV || 'development',
})

// Traces
const traceExporter = new OTLPTraceExporter({ url: `${endpoint}/v1/traces` })
const sdk = new NodeSDK({
    resource,
    traceExporter,
    instrumentations: [getNodeAutoInstrumentations()],
})

try {
    sdk.start()
} catch (err) {
    console.error('Error starting OpenTelemetry SDK', err)
}

// Logs
const loggerProvider = new LoggerProvider({ resource })
loggerProvider.addLogRecordProcessor(
    new BatchLogRecordProcessor(
        new OTLPLogExporter({ url: `${endpoint}/v1/logs` })
    )
)
logs.setGlobalLoggerProvider(loggerProvider)

// Graceful shutdown
async function shutdown() {
    try {
        await sdk.shutdown()
        if (typeof loggerProvider.shutdown === 'function') {
            await loggerProvider.shutdown()
        } else if (typeof loggerProvider.forceFlush === 'function') {
            await loggerProvider.forceFlush()
        }
    } catch (err) {
        console.error('Error shutting down OpenTelemetry', err)
    }
}

process.on('SIGTERM', () => {
    shutdown().finally(() => process.exit(0))
})
process.on('SIGINT', () => {
    shutdown().finally(() => process.exit(0))
})