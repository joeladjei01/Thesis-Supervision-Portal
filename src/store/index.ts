import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { IuserInfo, StateActions, UserStateType } from '../utils/types';

const initialState: UserStateType = {
  isLogin: false,
  accessToken: '',
  refreshToken: '',
  userInfo: {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    department: '',
    school: '',
    college: '',
    has_changed_password: false,
  },
  person: null,
};
const userStore = create<UserStateType & StateActions>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        updateAccessToken: (by: string) =>
          set((state) => ({ ...state, accessToken: by })),
        updatePerson: (student: any) =>
          set((state) => ({ ...state, person: student })),
        updateRefreshToken: (by: string) =>
          set((state) => ({ ...state, refreshToken: by })),
        updateIsLogin: (by: boolean) =>
          set((state) => ({ ...state, isLogin: by })),
        updateUserInfo: (by: IuserInfo) =>
          set((state) => ({
            ...state,
            userInfo: {
              ...state.userInfo,
              ...by,
            },
          })),
        reset: () => set(initialState),
      }),
      {
        name: 'user-store',
        version: 4,
      }
    )
  )
);

export default userStore;
