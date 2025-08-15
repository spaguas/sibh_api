const client = require('prom-client')

const register = new client.Registry()

client.collectDefaultMetrics({register})

const requestCount = new client.Counter({
  name: 'api_requests_total',
  help: 'Total de requisições recebidas',
  labelNames: ['method', 'route', 'status_code']
});

const requestDuration = new client.Histogram({
  name: 'api_request_duration_seconds',
  help: 'Tempo de resposta da API em segundos',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 1, 3, 5]
});

const uniqueUsers = new Set();

register.registerMetric(requestCount);
register.registerMetric(requestDuration);

module.exports = {
    register,
    requestCount,
    requestDuration,
    uniqueUsers
}