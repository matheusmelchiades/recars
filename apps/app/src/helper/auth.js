const TAG = '@RECARS::USER'

const setUser = (user) => localStorage.setItem(TAG, JSON.stringify(user));

const getUser = () => JSON.parse(localStorage.getItem(TAG))

const logOut = () => localStorage.removeItem(TAG)

export default { setUser, getUser, logOut }
