const { AccountCategories, CategoryInfo } = require("../models");

class CategoriesService {
  async create({ title, color, budget, accountId }) {
    const createdCategory = await AccountCategories.create({
      accountId,
    });

    const categoryInfo = await CategoryInfo.create({
      title,
      color,
      budget,
      accountCategoryId: createdCategory.id,
    });

    return { ...createdCategory.dataValues, ...categoryInfo.dataValues };
  }

  async getAll(accountId) {
    // todo: check if might be deleted
    const categoriesIds = await AccountCategories.findAll({
      where: { accountId },
    });

    const categories = await AccountCategories.findAll({
      attributes: ["id", "accountId"],
      where: { accountId },
      include: [
        {
          model: CategoryInfo,
          required: true,
          attributes: {
            exclude: ["createdAt", "updatedAt", "accountCategoryId"],
          },
        },
      ],
    });

    return categories;
  }
  async getOne(id) {
    if (!id) {
      throw new Error("не указан ID");
    }
    const category = await AccountCategories.findByPk(id, {
      include: [
        {
          model: CategoryInfo,
          required: true,
          attributes: {
            exclude: ["createdAt", "updatedAt", "accountCategoryId"],
          },
        },
      ],
    });
    return category;
  }

  async update(category) {
    if (!category.id) {
      throw new Error("не указан ID");
    }

    const updatedCategory = await CategoryInfo.update(category, {
      where: { accountCategoryId: category.id },
      returning: true,
      attributes: { exclude: ["createdAt", "updatedAt", "accountCategoryId"] },
    }).then((result) => result[1][0]);

    return updatedCategory;
  }

  async delete(id) {
    if (!id) {
      throw new Error("не указан ID");
    }

    const category = await AccountCategories.findOne({
      where: { id },
    });

    return await category
      .destroy()
      .then(() => "ok")
      .catch(() => "error");
  }
}

module.exports = new CategoriesService();
