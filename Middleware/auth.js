const { db } = require("../config/database");

const auth = (req, res, next) => {
  const { id, token } = req.body;

  if (!id || !token) {
    return res.status(400).json({ error: "ID or token is missing" });
  }

  const query = "SELECT * FROM tbl_users WHERE id = ?";

  db.execute(query, [id], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Database query error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const storedToken = results[0].token;

    if (token !== storedToken) {
      return res.status(401).json({ error: "Invalid token" });
    }

    next();
  });
};

module.exports = auth;
