const { Events } = require('discord.js');
const logger = require('../utils/logger');

module.exports = {
  name: Events.Warn,
  execute(message) {
    logger.warn(message);
  },
};
