import { defineStore } from 'pinia';
import type { IUser } from '@/types/user';

// 定义 Store
export const useStore = defineStore('user', {
    state: () => ({
        user: {
            id: null,
            name: ""
        } as IUser,
        token: ''
    }),
    actions: {
        setToken(token: string) {
            this.token = token;
        },
        setUser(user: IUser) {
            this.user = user;
        },
        clear(){
            this.user = null;
            this.token = ''
        }
    },
    // 持久化，pinia-plugin-persistedstate
    persist: {
        enabled: true,
        key: 'user-storage',
        storage: sessionStorage,
    },
});

