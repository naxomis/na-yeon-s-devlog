import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./photos.css";
import app from "./firebaseConfig";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useRecoilValue } from "recoil";
import { loginAtom } from "./loginAtom";

function EditTrip() {
  const db = getFirestore(app); // 파이어스토어 데이터베이스 연결
  const storage = getStorage(app); // 이미지 저장을 위한 스토리지 연결
  let isLogined = useRecoilValue(loginAtom);
  const navigate = useNavigate();
  const { docId } = useParams();

  // 데이터베이스의 필드들
  let [location1, setLocation1] = useState("");
  let [date1, setDate1] = useState("");
  let [comment, setComment] = useState("");
  let [photoURL, setPhotoURL] = useState("");
  let [image, setImage] = useState(null); // 업로드할 파일 객체

  useEffect(() => {
    const getData = async () => {
      const querySnapshot = await getDoc(doc(db, "tourMemo", docId)); // 콜렉션명: tourMemo
      const ob = querySnapshot.data();
      setLocation1(ob.location);
      setComment(ob.comment);
      setDate1(ob.date);
      setPhotoURL(ob.photoURL);
    };

    getData();
  }, [db, docId]);

  const locHandle = (e) => {
    setLocation1(e.target.value);
  };

  const dateHandle = (e) => {
    setDate1(e.target.value);
  };

  const commentHandle = (e) => {
    setComment(e.target.value);
  };

  const handleReset = () => {
    setLocation1("");
    setDate1("");
    setComment("");
    setImage(null);
  };

  const storeHandle = async (e) => {
    e.preventDefault();

    if (!isLogined) {
      alert("로그인을 해야 업로드가 가능합니다.");
      return;
    }
    if (image == null) return;

    const storageRef = ref(storage, "images/" + image.name);
    let photoURL = null;

    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          photoURL = downloadURL;

          setDoc(doc(db, "tourMemo", docId), {
            location: location1,
            date: date1,
            comment,
            photoURL,
          });

          setLocation1("");
          setDate1("");
          setComment("");
          setImage(null);

          alert("추억 여행을 수정했습니다.");
          navigate("/photos");
        });
      }
    );
  };

  return (
    <>
      <h1 style={{ marginInline: "2rem" }}>
        [링크 메뉴는 없음]추억 여행의 기록을 수정합니다.
      </h1>
      <h3 style={{ color: "red", marginInline: "2rem" }}>
        주) Image 수정을 반드시 해야 수정이 정상적으로 완료됩니다.
      </h3>
      <form>
        <div className="tourContainer">
          <div>여 행 지</div>
          <input
            type="text"
            id="여행지"
            onChange={locHandle}
            value={location1}
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
          />
          <img src={photoURL} alt="읽은 사진" width="300" />
          <div style={{ marginTop: "0.7em" }}>새 사진 선택(필수)</div>
          <input
            type="file"
            id="file"
            onChange={(e) => {
              setImage(e.target.files[0]);
            }}
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
              수정한 데이터 저장하기
            </button>
            &nbsp;
            <input
              type="reset"
              value="초기화"
              onClick={handleReset}
            />
          </div>
        </div>
      </form>
    </>
  );
}

export default EditTrip;
