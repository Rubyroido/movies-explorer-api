const router = require('express').Router();
const { validateUpdateProfile } = require('../middlewares/validate');

const {
  updateProfile, getProfile
} = require('../controllers/users');

router.get('/me', getProfile);
router.patch('/me', validateUpdateProfile, updateProfile);

module.exports = router;
