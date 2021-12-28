const categoriesService = require("../services/categoriesService.js");
const getValueFromCookie = require("../utils/getValueFromCookie.js");

class CategoriesController {
  async create(req, res) {
    const accountId = getValueFromCookie("accountId", req.headers.cookie);

    try {
      const { title, type, color, budget, icon } = req.body;
      const category = await categoriesService.create({
        title,
        type,
        color,
        budget,
        icon,
        accountId
      });
      res.json(category);
    } catch (e) {
      res.status(500).json(e);
    }
  }
  async getAll(req, res) {
    const accountId = getValueFromCookie("accountId", req.headers.cookie);

    try {
      const categories = await categoriesService.getAll(accountId);
      return res.json(categories);
    } catch (e) {
      res.status(500).json(e);
    }
  }
  async getOne(req, res) {
    try {
      const category = await categoriesService.getOne(req.params.id);
      return res.json(category);
    } catch (e) {
      res.status(500).json(e);
    }
  }
  async update(req, res) {
    try {
      const updatedCategory = await categoriesService.update(req.body);
      return res.json(updatedCategory);
    } catch (e) {
      res.status(500).json(e.message);
    }
  }
  async delete(req, res) {
    try {
      const category = await categoriesService.delete(req.params.id);
      return res.json(category);
    } catch (e) {
      res.status(500).json(e);
    }
  }
}

module.exports = new CategoriesController();
