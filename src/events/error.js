const { Events } = require('discord.js');
const logger = require('../utils/logger');

module.exports = {
  name: Events.Error,
  execute(error) {
    logger.error(error);
  },
};
