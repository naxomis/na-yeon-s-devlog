import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import app from "./firebaseConfig"; // Firebase 초기화
import "./Login.css";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { loginAtom } from "./loginAtom";
import { useRecoilState } from "recoil";

const Login = () => {
  const [isLogined, setIsLogined] = useRecoilState(loginAtom);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const pwRef = useRef(); // 비밀번호 입력에 포커싱
  const navigate = useNavigate(); // 리다이렉트 사용
  const auth = getAuth(app);

  // 이메일 입력 핸들러
  const emailChangeHandle = (e) => {
    setEmail(e.target.value);
  };

  // 비밀번호 입력 핸들러
  const passwordChangeHandle = (e) => {
    setPassword(e.target.value);
  };

  // 회원가입 처리 함수
  const signUpHandle = (e) => {
    e.preventDefault();

    if (!password || password.length < 6) {
      alert("비밀번호는 6자리 이상이어야 합니다.");
      pwRef.current.focus();
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        alert("회원가입이 완료되었습니다.");
        setEmail("");
        setPassword("");
      })
      .catch((error) => {
        console.error("회원가입 오류:", error);
        alert(`회원가입 실패: ${error.message}`);
      });
  };

  // 로그인 처리 함수
  const signInHandle = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("로그인 성공:", user.uid);
        setIsLogined(true);
        alert("로그인에 성공했습니다.");
        setEmail("");
        setPassword("");
        navigate("/"); // 홈으로 리다이렉트
      })
      .catch((error) => {
        console.error("로그인 오류:", error);
        alert(`로그인 실패: ${error.message}`);
      });
  };

  // 로그아웃 처리 함수
  const logOutHandle = () => {
    signOut(auth)
      .then(() => {
        setIsLogined(false);
        alert("로그아웃이 완료되었습니다.");
        navigate("/login");
      })
      .catch((error) => {
        console.error("로그아웃 오류:", error);
        alert(`로그아웃 실패: ${error.message}`);
      });
  };

  return (
    <div className="loginPage">
      <h2>Email/Password 로그인</h2>
      <form className="loginForm">
        <label>
          &nbsp;&nbsp; e-mail &nbsp;&nbsp;:{" "}
          <input
            type="text"
            value={email}
            onChange={emailChangeHandle}
            id="email"
          />
        </label>
        <label>
          password :{" "}
          <input
            type="password"
            ref={pwRef}
            value={password}
            onChange={passwordChangeHandle}
            id="password"
          />
        </label>
        <p>
          {isLogined ? (
            <button type="button" onClick={logOutHandle}>
              로그아웃
            </button>
          ) : (
            <button type="button" onClick={signInHandle}>
              로그인
            </button>
          )}
          &nbsp;
          <button type="button" id="register" onClick={signUpHandle}>
            회원가입
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
