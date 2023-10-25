import { validate } from '../validation/validation.js'
import { registerUserValidation, loginUserValidation, getUserValidation, updateUserValidation } from '../validation/user-validation.js'
import { prismaClient } from '../apps/database.js'
import { ResponseError } from '../error/response-error.js'
import bcrypt from 'bcrypt'
import { v4 as uuid } from 'uuid'

const register = async (request) => {
  const user = validate(registerUserValidation, request)

  const countEmail = await prismaClient.user.count({
    where: {
      email: user.email
    }
  })

  if (countEmail === 1) {
    throw new ResponseError(400, 'email already taken')
  }

  const countUsername = await prismaClient.user.count({
    where: {
      username: user.username
    }
  })

  if (countUsername === 1) {
    throw new ResponseError(400, 'username already exist')
  }

  user.password = await bcrypt.hash(user.password, 10)

  return prismaClient.user.create({
    data: user,
    select: {
      username: true,
      name: true,
      email: true
    }
  })
}

const login = async (request) => {
  const loginRequest = validate(loginUserValidation, request)

  const user = await prismaClient.user.findUnique({
    where: {
      username: loginRequest.username
    },
    select: {
      username: true,
      password: true
    }
  })
  if (!user) {
    throw new ResponseError(401, 'Username or password wrong')
  }
  const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password)
  if (!isPasswordValid) {
    throw new ResponseError(401, 'Username or password wrong')
  }
  const token = uuid().toString()
  return prismaClient.user.update({
    data: {
      token
    },
    where: {
      username: user.username
    },
    select: {
      token: true
    }
  })
}

const get = async (username) => {
  username = validate(getUserValidation, username)

  const user = await prismaClient.user.findUnique({
    where: {
      username
    },
    select: {
      username: true,
      name: true
    }
  })
  if (!user) {
    throw new ResponseError(404, 'user is not found')
  }
  return user
}

const update = async (request) => {
  const user = validate(updateUserValidation, request)

  const countUser = await prismaClient.user.count({
    where: {
      username: user.username
    }
  })
  if (countUser !== 1) {
    throw new ResponseError(404, 'user not found')
  }

  const data = {}
  if (user.name) {
    data.name = user.name
  }
  if (user.password) {
    data.password = await bcrypt.hash(user.password, 10)
  }

  return prismaClient.user.update({
    where: {
      username: user.username
    },
    data,
    select: {
      username: true,
      name: true
    }
  })
}

const logout = async (username) => {
  username = validate(getUserValidation, username)

  const user = await prismaClient.user.findUnique({
    where: {
      username
    }
  })
  if (!user) throw new ResponseError(404, 'user not found')

  return prismaClient.user.update({
    where: {
      username
    },
    data: {
      token: null
    },
    select: {
      username: true
    }
  })
}

export default {
  register,
  login,
  get,
  update,
  logout
}
