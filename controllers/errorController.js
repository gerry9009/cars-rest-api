const errorController = (req, res) => {
  res.status(404);
  res.json({ error: "Page not found" });
};

module.exports = errorController;
