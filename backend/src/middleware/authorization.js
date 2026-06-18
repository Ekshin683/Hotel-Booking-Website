exports.authorize = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          message: "Access denied. Insufficient permissions",
        });
      }

      next();
    } catch (err) {
      res.status(500).json({ message: "Authorization check failed" });
    }
  };
};

exports.requireRole = (role) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      if (req.user.role !== role) {
        return res.status(403).json({
          message: `This action requires ${role} role`,
        });
      }

      next();
    } catch (err) {
      res.status(500).json({ message: "Authorization check failed" });
    }
  };
};

exports.isAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: "Authorization check failed" });
  }
};

exports.isCustomer = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (req.user.role !== "customer") {
      return res.status(403).json({ message: "Customer access required" });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: "Authorization check failed" });
  }
};

exports.isHotelStaff = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (req.user.role !== "hotelStaff") {
      return res.status(403).json({ message: "Hotel staff access required" });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: "Authorization check failed" });
  }
};

exports.checkOwnership = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    if (req.user.userId !== req.resourceOwnerId && req.user.role !== "admin") {
      return res.status(403).json({
        message: "You do not have permission to access this resource",
      });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: "Authorization check failed" });
  }
};