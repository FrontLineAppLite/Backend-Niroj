const validateBody = (schema) => {
    return (req, res, next) => {
      const { error } = schema.validate(req.body);
      if (error) {
        const message = error.details[0].message;
        return res.status(400).json({ success: false, message });
      }
      next();
    };
  };
  
  const validateParams = (schema) => {
    return (req, res, next) => {
      const { error } = schema.validate(req.params);
      if (error) {
        const message = error.details[0].message;
        return res.status(400).json({ success: false, message });
      }
      next();
    };
  };
  
  module.exports = {
    validateBody,
    validateParams
  };