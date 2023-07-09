const User = require('../models/user');

const addImage = async (req, res) => {

  try {
    console.log('enterrred');

    const userId = req.user.id; // Assuming you have middleware to authenticate and attach the user object to the request
    const user = await User.findById(userId);

    // Save the image in the user object
    user.image = req.file.filename; // Assuming you have configured file uploading and the uploaded file is available as 'req.file'

    // Save the updated user object
    await user.save();

    res.send(req.file.filename);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading image.' });
  }
};

module.exports = {
  addImage,
};