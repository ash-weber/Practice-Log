function validateGoogleLogin(req, res, next) {
  const userData = req.body;

  const errors = [];

  if (!userData) {
    errors.push('No user data provided');
  } else {
    if (!userData.email || typeof userData.email !== 'string') {
      errors.push('Email is required and must be a string');
    } else if (!validateEmailFormat(userData.email)) {
      errors.push('Invalid email format');
    }

    if (!userData.name || typeof userData.name !== 'string') {
      errors.push('Name is required and must be a string');
    }

    if (!userData.sub || typeof userData.sub !== 'string') {
      errors.push('Google user ID (sub) is required');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }


  next();
}

function validateEmailFormat(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

module.exports = validateGoogleLogin;
