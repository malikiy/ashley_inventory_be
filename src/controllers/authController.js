const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const { generateToken } = require('../utils/jwt');
const { resSuccess, resError } = require('../utils/response');

const prisma = new PrismaClient();

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user_Access.findUnique({ where: { email } });
    if (!user) return resError(res, 'User not found', 404);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return resError(res, 'Invalid credentials', 401);

    const token = generateToken(user);
    return resSuccess(res, 'Login successful', { token });
  } catch (err) {
    console.error(err);
    return resError(res, 'Login failed');
  }
};

exports.register = async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    const existingUser = await prisma.user_Access.findUnique({ where: { email } });
    if (existingUser) return resError(res, 'Email already registered', 400);

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user_Access.create({
      data: {
        full_name,
        email,
        password: hashedPassword,
        status: 1
      }
    });

    return resSuccess(res, 'User registered successfully', {
      id: newUser.id,
      email: newUser.email
    }, 201);
  } catch (err) {
    console.error(err);
    return resError(res, 'Registration failed');
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await prisma.user_Access.findUnique({ where: { email } });
    // tetap return sukses meski email gak ditemukan
    return resSuccess(res, 'If your email is registered, you can proceed to reset your password.');
  } catch (err) {
    console.error(err);
    return resError(res, 'Forgot password failed');
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, new_password, confirm_password } = req.body;

    if (new_password !== confirm_password) {
      return resError(res, 'Passwords do not match', 400);
    }

    if (new_password.length < 6) {
      return resError(res, 'Password must be at least 6 characters', 400);
    }

    const user = await prisma.user_Access.findUnique({ where: { email } });
    if (!user) return resError(res, 'User not found', 404);

    const hashedPassword = await bcrypt.hash(new_password, 10);

    await prisma.user_Access.update({
      where: { email },
      data: { password: hashedPassword }
    });

    return resSuccess(res, 'Password updated successfully');
  } catch (err) {
    console.error(err);
    return resError(res, 'Reset password failed');
  }
};
