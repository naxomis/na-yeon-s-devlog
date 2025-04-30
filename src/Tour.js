import React, { useState } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import app from "./firebaseConfig";
import "./App.css";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { useRecoilValue } from "recoil";
import { loginAtom } from "./loginAtom";

const Tour = () => {
  // Firestore와 Storage 초기화
  const db = getFirestore(app);
  const storage = getStorage(app);
  const isLogined = useRecoilValue(loginAtom);

  // 상태 변수
  const [location1, setLocation1] = useState("");
  const [date1, setDate1] = useState("");
  const [comment, setComment] = useState("");
  const [image, setImage] = useState(null); // 업로드할 파일 객체

  // 입력 핸들러 함수
  const locHandle = (e) => setLocation1(e.target.value);
  const dateHandle = (e) => setDate1(e.target.value);
  const commentHandle = (e) => setComment(e.target.value);
  const handleReset = () => {
    setLocation1("");
    setDate1("");
    setComment("");
    setImage(null);
  };

  // 데이터 저장 처리 함수
  const storeHandle = async (e) => {
    e.preventDefault();

    if (!isLogined) {
      alert("로그인을 해야 업로드가 가능합니다.");
      return;
    }

    if (!image) {
      alert("이미지를 선택해야 합니다.");
      return;
    }

    try {
      // Storage에 이미지 업로드
      const storageRef = ref(storage, `images/${image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error("업로드 중 오류 발생:", error);
          alert(`업로드 실패: ${error.message}`);
        },
        async () => {
          // 업로드 완료 후 다운로드 URL 가져오기
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("File available at", downloadURL);

          // Firestore에 데이터 저장
          await addDoc(collection(db, "memo"), {
            location: location1,
            date: date1,
            comment,
            photoUrl: downloadURL, // 필드 이름은 photoUrl로 일관성 유지
          });

          // 상태 초기화
          handleReset();
          alert("한 건의 여행 추억이 등록되었습니다.");
        }
      );
    } catch (error) {
      console.error("스토리지 저장 중 오류:", error);
      alert(`스토리지 저장 실패: ${error.message}`);
    }
  };

  return (
    <div>
      <h1 style={{ textAlign: "center", marginTop: "100px", color: "brown" }}>
        나의 여행 등록하기
        <span style={{ fontSize: "16px" }}>(로그인 상태에서만 가능함)</span>
      </h1>
      <form>
        <div className="tourContainer">
          <div>여 행 지</div>
          <input
            type="text"
            id="여행지"
            onChange={locHandle}
            value={location1}
            placeholder="여행지를 입력하세요"
            style={{ lineHeight: "1.6em" }}
          />
          <div style={{ marginTop: "0.7em" }}>날 짜</div>
          <input
            type="date"
            id="date"
            onChange={dateHandle}
            value={date1}
          />
          <div style={{ marginTop: "0.7em" }}>한 줄 평</div>
          <textarea
            cols="40"
            id="평가"
            onChange={commentHandle}
            value={comment}
            placeholder="한 줄 평을 입력하세요"
          />
          <div style={{ marginTop: "0.7em" }}>사 진 첨 부</div>
          <input
            type="file"
            id="file"
            onChange={(e) => setImage(e.target.files[0])}
          />
          <div
            style={{
              display: "inline-block",
              marginTop: "0.7em",
              fontSize: "24px",
            }}
          >
            <button
              type="submit"
              onClick={storeHandle}
              style={{
                color: "white",
                backgroundColor: "blue",
              }}
            >
              저장소에 저장하기
            </button>
            &nbsp;
            <input type="reset" value="초기화" onClick={handleReset} />
          </div>
        </div>
      </form>
    </div>
  );
};

export default Tour;
