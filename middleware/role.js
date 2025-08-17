const roleMiddleware = (role) => (req, res, next) => {
  try {
    console.log(req.user.role, "line no 4");
    if (req.user.role !== role) {
      return res
        .status(403)
        .json({ message: "Access denied: You don't have permission" });
    }
    next();
  } catch (error) {
    return res.status(403).json({ message: "Access denied: " + error.message });
  }
};

module.exports = roleMiddleware;
