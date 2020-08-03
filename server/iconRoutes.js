const OAuth = require('oauth');

const KEY = "a72a8359d023400ba07f110326759cb9"
const SECRET = "95b6e71443ca4804b46f33464838b75d"

const oauth = new OAuth.OAuth(
	'http://api.thenounproject.com',
	'http://api.thenounproject.com',
	KEY,
	SECRET,
	'1.0',
	null,
	'HMAC-SHA1'
);

exports.getIcons = (req, res) => {
  oauth.get(
    'http://api.thenounproject.com/icons/' + req.query.searchWord + '?limit=20',
    null,
    null,
    function (e, data) {
      if (e) res.json({ success: false, icons: [] });
      res.json({ success: true, icons: JSON.parse(data).icons.map(icon => icon.preview_url) });
    }
  );
}