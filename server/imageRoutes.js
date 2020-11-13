const Image = require('./image');

const getImageFields = image => {
  const { _id, data } = image;
  return { id: _id, data };
}

exports.createImage = (req, res) => {
  const { data } = req.body;
  const image = new Image({ data });
  image.save(error => {
    if (error) return res.json({ success: false, error });
    return res.json({ success: true, image: getImageFields(image) });
  });
}

exports.getImageById = (req, res) => {
  const { id } = req.query;
  Image.findById(id).then(image => {
    if (!image) {
      return res.json({ success: false });
    } else {
      return res.json({ success: true, image: getImageFields(image) });
    }
  });
}

exports.updateImage = (req, res) => {
  const { id, data } = req.body;
  Image.findByIdAndUpdate(id, { data }, { new: true }, (error, image) => {
    if (error) return res.json({ success: false, error });
    return res.json({ success: true, image: getImageFields(image) });
  })
}