const statsService = require("../services/statsService.js");
const getValueFromCookie = require("../utils/getValueFromCookie.js");

class StatsController {
  async getAll(req, res) {
    const accountId = getValueFromCookie("accountId", req.headers.cookie);
    const { period, type } = req.query;

    const choosePeriod = {
      year: statsService.getByYear,
      month: statsService.getByMonth,
      week: statsService.getByWeek,
    };

    const chooseGroupType = {
      card: statsService.getByCard,
      category: statsService.getByCategory,
    };

    try {
      // const transactions = await choosePeriod[period](accountId);
      const transactions = await chooseGroupType[type](accountId);

      // const transactions = await statsService.getByCard(accountId);
      return res.json(transactions);
    } catch (e) {
      res.status(500).json(e);
    }
  }

  async getStatByPeriod(req, res) {
    try {
      const accountId = getValueFromCookie("accountId", req.headers.cookie);

      const { period } = req.query;

      const choosePeriod = {
        year: statsService.getByYear,
        month: statsService.getByMonth,
        week: statsService.getByWeek,
      };

      let stats;

      if (choosePeriod[period]) {
        stats = await choosePeriod[period](accountId);
      }

      return res.json(stats);
    } catch (e) {
      res.status(500).json(e);
    }
  }

  async getStatByCard(req, res) {
    try {
      const accountId = getValueFromCookie("accountId", req.headers.cookie);

      const stats = await statsService.getByCard(accountId);

      return res.json(stats);
    } catch (e) {
      res.status(500).json(e);
    }
  }

  async getStatByCategory(req, res) {
    try {
      const accountId = getValueFromCookie("accountId", req.headers.cookie);

      const stats = await statsService.getByCategory(accountId);

      return res.json(stats);
    } catch (e) {
      res.status(500).json(e);
    }
  }
}

module.exports = new StatsController();
