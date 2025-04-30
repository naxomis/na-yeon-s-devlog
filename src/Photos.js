import React, { useState, useEffect } from "react";
import "./photos.css";
import app from "./firebaseConfig";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { Link, useNavigate } from "react-router-dom";

const Photos = () => {
  const db = getFirestore(app); // Firestore 데이터베이스 연결
  const storage = getStorage(app); // Storage(이미지 저장)
  const navigate = useNavigate();

  const [displayList, setDisplayList] = useState([]); // 화면에 보여줄 데이터
  const [docId, setDocId] = useState([]); // 문서 ID(수정 시 사용)
  const [error, setError] = useState(null); // 오류 메시지 저장용 상태

  // Firestore에서 데이터를 가져오는 함수
  useEffect(() => {
    const getData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "memo"));
        setDisplayList([]); // 초기화
        setDocId([]); // 초기화

        querySnapshot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data());
          setDocId((prevId) => [...prevId, doc.id]); // 문서 ID 저장
          let ob = doc.data(); // 문서 데이터를 객체로 저장
          setDisplayList((arr) => [...arr, ob]);
        });
      } catch (error) {
        console.error("Firestore 데이터 가져오기 실패:", error);
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      }
    };

    getData();
  }, [db]); // Firestore 데이터베이스 의존성 추가

  // 삭제 처리 함수
  const deleteHandle = async (docId, photoUrl) => {
    try {
      // 이미지 파일 참조 생성
      const photoImageRef = ref(storage, photoUrl);

      // Storage에서 이미지 삭제
      await deleteObject(photoImageRef);
      console.log("이미지 삭제 성공");

      // Firestore에서 문서 삭제
      await deleteDoc(doc(db, "memo", docId));
      console.log("문서 삭제 성공");

      alert("데이터가 삭제되었습니다.");
      // 화면 새로고침 없이 상태 업데이트
      setDisplayList((prevList) =>
        prevList.filter((item, index) => docId[index] !== docId)
      );
      setDocId((prevIds) => prevIds.filter((id) => id !== docId));
    } catch (error) {
      console.error("삭제 중 오류 발생:", error);
      setError("데이터 삭제 중 오류가 발생했습니다.");
      alert("삭제 중 문제가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div>
      <h1>여기는 추억의 사진들이 전시될 공간 ....</h1>
      <h3>
        Firestore db에 존재하는 각 문서의 필드명 : [location, date, comment, photoUrl]
      </h3>

      {/* 오류 메시지 표시 */}
      {error && <div className="error">{error}</div>}

      <section className="cards">
        {displayList.length === 0 ? (
          <p>데이터가 없습니다. 여행 정보를 등록해주세요.</p>
        ) : (
          displayList.map((item, index) => (
            <div className="card" key={docId[index]}>
              <img
                className="cardImage"
                src={item.photoUrl} // photoUrl 필드 사용
                alt="추억의 사진"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/150?text=Image+Not+Available";
                  console.error("이미지 로드 실패:", e.target.src);
                }}
              />
              <div className="cardContent">
                <h2 className="cardTitle">{item.location}</h2>
                <p className="cardText">{item.comment}</p>
                <p className="cardDate">{item.date}</p>
              </div>
              <div className="buttons">
                {/* 수정 페이지로 이동 */}
                <Link to={"/editTrip/" + docId[index]} className="editButton">
                  Edit
                </Link>
                {/* 데이터베이스와 Storage 폴더 내용 삭제 */}
                <button
                  type="button"
                  className="deleteButton"
                  onClick={() => deleteHandle(docId[index], item.photoUrl)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default Photos;
