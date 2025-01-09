import { createSlice } from '@reduxjs/toolkit';


// const loginSlice = createSlice({
//   name: 'login', 
//   initialState: {
//     isLogggedIn: false,
//     loginData: null, 
//   },
//   reducers: {
  
//     setLoginData: (state, action) => {
//       state.isLogggedIn = true; 
//       state.loginData = action.payload;
//     },
    
//     logout: (state) => {
//       state.isLogggedIn = false;
//       state.loginData = null; 
//     },
//   },
// });

const initialState = {
  isLogggedIn: false,
  loginData: null, 
};

const loginSlice = createSlice({
  name: 'login', 
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLogggedIn = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isLogggedIn = false;
      state.user = null;
    },
  },
});

export const { login, logout } = loginSlice.actions;
// export const { setLoginData, logout } = loginSlice.actions;
export default loginSlice.reducer;
