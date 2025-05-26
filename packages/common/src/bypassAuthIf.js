/**
 * Wraps an auth middleware so it is skipped when `condition` is true.
 * Usage: router.use(bypassAuthIf(process.env.BYPASS_AUTH==='1', auth));
 */
module.exports = function bypassAuthIf(condition, authMiddleware) {
    return condition ? (_req, _res, next) => next() : authMiddleware;
  };