const Image = require('./image');

const getDerivedImage = image => {
  const { _id, data } = image;
  return { id: _id, data };
}

exports.createImage = (req, res) => {
  const { data } = req.body;
  const image = new Image({ data });
  image.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, image: getDerivedImage(image) });
  });
}

exports.getImageById = (req, res) => {
  const { id } = req.query;
  Image.findById(id).then(function(image) {
    if (!image) {
      return res.json({ success: false });
    } else {
      return res.json({ success: true, image: getDerivedImage(image) });
    }
  });
}

exports.updateImage = (req, res) => {
  const { id, data } = req.body;
  Image.findByIdAndUpdate(id, { data }, { new: true }, (err, image) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, image: getDerivedImage(image) });
  })
}