import React from 'react'
import PropTypes from 'prop-types'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { loginSelector } from './loginSlice.js'

export const PrivateRoute = ({ children }) => {
  const { accessToken, isAuthChecked } = useSelector(loginSelector)

  if (!isAuthChecked) {
    return null
  }

  if (!accessToken) {
    return <Navigate to='/login' />
  }

  return children
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
}
