import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";
import EndoCards from "./EndoCards";

function Feedback() {
  const [allEndoIdList, setAllEndoIdList] = useState([]);
  const { currentUser } = useAuth();
  const getAllMembers = () => {
    db.collection("users")
      .doc(currentUser.uid)
      .collection("feedback")
      .orderBy("timeStamp", "desc")
      .onSnapshot((snapshot) => {
        const endoIdList = snapshot.docs.map((doc) => ({
          id: doc.id,
          giverId: doc.data().giverId,
          giverEndorsement: doc.data().giverFeedback,
          task: doc.data().task,
          teamName: doc.data().teamName,
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
          key={endo.id}
          memberId={currentUser.uid}
          giverId={endo.giverId}
          giverEndorsement={endo.giverEndorsement}
          feedback={true}
          task={endo.task}
          id={endo.id}
          teamName={endo.teamName}
        />
      ))}
    </div>
  );
}

export default Feedback;
