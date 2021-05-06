import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";
import EndoCards from "./EndoCards";
import nothing from "../../assets/images/nothing.svg";

function Endo() {
  const [allEndoIdList, setAllEndoIdList] = useState([]);
  const { currentUser } = useAuth();
  const getAllMembers = () => {
    db.collection("users")
      .doc(currentUser.uid)
      .collection("endorsement")
      .onSnapshot((snapshot) => {
        const endoIdList = snapshot.docs.map((doc) => ({
          giverId: doc.data().giverId,
          giverEndorsement: doc.data().giverEndorsement,
        }));
        setAllEndoIdList(endoIdList);
      });
  };

  useEffect(() => {
    getAllMembers();
  }, []);
  return (
    <div
      style={{
        width: "100%",
        overflowY: "scroll",
        marginBottom: "0.5rem",
        height: "74vh",
      }}
    >
      {allEndoIdList.length === 0 && (
        <div
          style={{
            height: "60%",
            width: "60%",
            position: "absolute",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            color: "rgb(5, 185, 125)",
          }}
        >
          <img src={nothing} style={{ height: "13rem", width: "13rem" }} />

          <p style={{ marginLeft: "2rem" }}>Nothing to show</p>
        </div>
      )}
      {allEndoIdList?.map((endo) => (
        <EndoCards
          key={endo.giverId}
          memberId={currentUser.uid}
          giverId={endo.giverId}
          giverEndorsement={endo.giverEndorsement}
        />
      ))}
    </div>
  );
}

export default Endo;
