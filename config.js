var config = {};


config.cookieSession = {keys: ['dfkj£234', '23498908*(']};
config.cookieParser = '23sdf23sdf$£!@';

config.host = process.env.HOST;


config.port = process.env.PORT || 3000;
config.session = {};
config.session.secret = '345JLKJ890d7SH!SDFLKJ';
config.session.key = 'sess';
config.session.duration = 8 * 60 * 60 * 1000;
config.session.activeDuration = 8 * 60 * 60 * 24;

module.exports = config;


