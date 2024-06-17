import ranger from './ranger';
import Range from './Range';
import { sendMetricsToMonitoring } from './monitoring';

export { Range };
export default ranger;

setInterval(() => {
  const metrics = ranger.getRateLimiterMetrics();
  sendMetricsToMonitoring('rate-limiter', metrics);
}, 60000); // Send metrics every minute

// TODO: Implement sendMetricsToMonitoring function
// to integrate with monitoring tools or dashboards
