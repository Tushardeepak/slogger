import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";
import EndoCards from "./EndoCards";

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
