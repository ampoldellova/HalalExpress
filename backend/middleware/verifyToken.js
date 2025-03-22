const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    const user = jwt.verify(token, process.env.JWT_SEC);
    req.user = user;
    next();
  }
};

const verifyAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (
      req.user.userType === "Client" ||
      req.user.userType === "Vendor" ||
      req.user.userType === "Supplier" ||
      req.user.userType === "Admin"
    ) {
      next();
    } else {
      res
        .status(403)
        .json({ status: false, message: "You are not Authorized User" });
    }
  });
};

const verifyVendor = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.userType === "Vendor" || req.user.userType === "Admin") {
      next();
    } else {
      res
        .status(403)
        .json({ status: false, message: "You are not Authorized Vendor" });
    }
  });
};

const verifySupplier = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.userType === "Supplier" || req.user.userType === "Admin") {
      next();
    } else {
      res
        .status(403)
        .json({ status: false, message: "You are not Authorized Supplier" });
    }
  });
};

const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.userType === "Admin") {
      next();
    } else {
      res
        .status(403)
        .json({ status: false, message: "You are not Authorized Admin" });
    }
  });
};

module.exports = {
  verifyToken,
  verifyAndAuthorization,
  verifyVendor,
  verifySupplier,
  verifyAdmin,
};
