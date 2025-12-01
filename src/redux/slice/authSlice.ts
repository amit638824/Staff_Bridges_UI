import { createSlice, PayloadAction } from '@reduxjs/toolkit'; 

const initialState: any = {
  user: {},
  token: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login(state, action: any) {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout(state) {
      state.user={}
      state.token = null;
    },
  },
});

export const { login,logout } :any= userSlice.actions;
export default userSlice.reducer;


export const useSession=()=>{
    return
}