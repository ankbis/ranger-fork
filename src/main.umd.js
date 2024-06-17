import ranger from './ranger';
import Range from './Range';
import RateLimiter from './middleware/RateLimiter';

ranger.Range = Range;
ranger.RateLimiter = RateLimiter;

export default ranger;
