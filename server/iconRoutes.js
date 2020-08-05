const axios = require('axios');

exports.getIcons = (req, res) => {
  axios.get('https://api.iconfinder.com/v4/icons/search?query=' + req.query.searchWord + '&count=20', {
    headers: {
      authorization: 'Bearer B4jUYgw0xve99CQTbcq6zXxRQQUuwpV0ShgQYXuHkOaJ0UgFRN2zATYGVl2X5sOM'
    }
  }).then(function(response) {
    res.json({
      success: true,
      icons: response.data.icons.map(icon => icon.raster_sizes[8].formats[0].preview_url)
    });
  }).catch(error => {
    res.json({ success: false, error });
  });
}