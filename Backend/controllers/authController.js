import User from '../models/User.js'
import { generateToken } from '../middleware/auth.js'

// @desc    User Signup
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password',
      })
    }

    // Check if user already exists
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      })
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      avatar: name.split(' ').map(n => n[0]).join('').toUpperCase(),
    })

    // Generate token
    const token = generateToken(user._id)

    // Return response
    res.status(201).json({
      success: true,
      token,
      user: user.toJSON(),
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error in signup',
    })
  }
}

// @desc    User Login
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      })
    }

    // Check if user exists (need password for comparison)
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      })
    }

    // Check password
    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      })
    }

    // Generate token
    const token = generateToken(user._id)

    // Return response
    res.status(200).json({
      success: true,
      token,
      user: user.toJSON(),
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error in login',
    })
  }
}

// @desc    Get Current User
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)

    res.status(200).json({
      success: true,
      user,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    })
  }
}

// @desc    Update User Profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name, phoneNumber, profileImage, bankName, accountNumber, ifscCode, initialBalance } = req.body

    const updateData = {}
    if (name) updateData.name = name
    if (phoneNumber) updateData.phoneNumber = phoneNumber
    if (profileImage) updateData.profileImage = profileImage
    if (bankName) updateData.bankName = bankName
    if (accountNumber) updateData.accountNumber = accountNumber
    if (ifscCode) updateData.ifscCode = ifscCode
    if (initialBalance !== undefined) updateData.initialBalance = Number(initialBalance)

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    )

    res.status(200).json({
      success: true,
      user,
      message: 'Profile updated successfully',
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    })
  }
}
