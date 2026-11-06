import { loggedOut } from './loginSlice.js'

export const handleLogout = () => (dispatch) => {
  dispatch(loggedOut())
}
