import { createSlice} from "@reduxjs/toolkit";
import {type PayloadAction } from "@reduxjs/toolkit";

// 1. Define the shape of the user object
interface UserInfo {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// 2. Define the shape of the entire state
interface UserState {
  isUser: boolean;
  userInfo: UserInfo | null;
}

// Helper to safely parse localStorage
const getSavedUser = (): UserInfo | null => {
  const saved = localStorage.getItem('user-info-llm');
  if (!saved) return null;
  try {
    return JSON.parse(saved) as UserInfo;
  } catch {
    return null;
  }
};

const initialState: UserState = {
  isUser: !!getSavedUser(),
  userInfo: getSavedUser(),
};


const userSlice = createSlice({
  name: "User",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<UserInfo>) => {
      state.isUser = true;
      state.userInfo = action.payload;
      localStorage.setItem('user-info-llm', JSON.stringify(action.payload));
    },
    
    logout: (state) => {
      state.isUser = false;
      state.userInfo = null;
      localStorage.removeItem('user-info-llm');
      localStorage.removeItem('user-data-llm');

    },

    updateUserInfo: (state, action: PayloadAction<Partial<UserInfo>>) => {
      if (state.userInfo) {
        state.userInfo = { ...state.userInfo, ...action.payload };
        localStorage.setItem('user-info-llm', JSON.stringify(state.userInfo));
      }
    }
  }
});

export const { login, logout, updateUserInfo } = userSlice.actions;
export const UserReducer = userSlice.reducer;