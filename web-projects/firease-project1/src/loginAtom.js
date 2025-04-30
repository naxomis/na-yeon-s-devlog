//loginAtom.js

import { atom } from "recoil";

//recoil : 전역 상태 변수 관리

export const  loginAtom = atom({
   key: "loginAtom", // 고유한 ID (with respect to other atoms/selectors)
   default: false, // default value (초기값)//logout
});
