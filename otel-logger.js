import { logs, SeverityNumber } from '@opentelemetry/api-logs'

const logger = logs.getLogger('dummy')

export function logDebug(message, attributes = {}) {
    logger.emit({
        body: message,
        severityNumber: SeverityNumber.DEBUG,
        severityText: 'DEBUG',
        attributes,
    })
    console.debug(`${new Date().toISOString()} DEBUG ` + message, attributes)
}

export function logInfo(message, attributes = {}) {
    logger.emit({
        body: message,
        severityNumber: SeverityNumber.INFO,
        severityText: 'INFO',
        attributes,
    })
    console.info(`${new Date().toISOString()} INFO ` + message, attributes)
}

export function logWarn(message, attributes = {}) {
    logger.emit({
        body: message,
        severityNumber: SeverityNumber.WARN,
        severityText: 'WARN',
        attributes,
    })
    console.warn(`${new Date().toISOString()} WARN ` + message, attributes)
}

export function logError(message, attributes = {}) {
    logger.emit({
        body: message,
        severityNumber: SeverityNumber.ERROR,
        severityText: 'ERROR',
        attributes,
    })
    console.error(`${new Date().toISOString()} ERROR ` + message, attributes)
}