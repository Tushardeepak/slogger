import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Doughnut } from "react-chartjs-2";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import CustomTooltip from "../CustomTooltip";
import { generateMedia } from "styled-media-query";

function DonutChart({ todoLength }) {
  const [data, setData] = useState({});
  const [checkCount, setCheckCount] = useState(0);
  const { currentUser } = useAuth();
  var array = [];
  var colors = [];

  function getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  useEffect(() => {
    if (todoLength !== 0) {
      for (var i = 0; i < todoLength; i++) {
        array.push(10);
        const color = getRandomColor();
        colors.push(color);
      }
    }
    setData({
      datasets: [
        {
          data: array,
          backgroundColor: colors,
        },
      ],
    });
  }, [todoLength]);

  const handleCheckLength = (list) => {
    const check = list.filter((check) => {
      if (check.checked === true) {
        return check;
      }
    });
    const c = check.length;
    setCheckCount(c);
  };

  React.useEffect(() => {
    db.collection("users")
      .doc(currentUser.uid)
      .collection("todos")
      .onSnapshot((snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          todoText: doc.data().todoText,
          todoDate: doc.data().todoDate,
          checked: doc.data().checked,
        }));

        handleCheckLength(list);
      });
  }, []);

  return (
    <CustomTooltip title="Visual representation of total work" placement="top">
      <ChartContainer>
        <Doughnut
          data={data}
          options={{
            maintainAspectRatio: false,
            tooltips: {
              enabled: false,
            },
          }}
          height={200}
          width={200}
        ></Doughnut>

        <CustomTooltip
          title={
            Math.floor((checkCount / todoLength) * 100) === 0
              ? `${Math.floor(
                  (checkCount / todoLength) * 100
                )}% of work is done`
              : `Congrats: ${Math.floor(
                  (checkCount / todoLength) * 100
                )}% of work is done`
          }
          placement="top"
        >
          <Percentage>
            {Math.floor((checkCount / todoLength) * 100)}%
          </Percentage>
        </CustomTooltip>
      </ChartContainer>
    </CustomTooltip>
  );
}

export default DonutChart;

const customMedia = generateMedia({
  lgDesktop: "1350px",
  mdDesktop: "1150px",
  tablet: "960px",
  smTablet: "600px",
});

const ChartContainer = styled.div`
  margin-top: 1rem;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  ${customMedia.lessThan("smTablet")`
  margin-top:2rem;
    `};
`;

const Percentage = styled.p`
  position: absolute;
  top: 43%;
  left: 43%;
  font-size: 1.7rem;
  font-weight: 600;
  color: rgb(0, 82, 52);
  cursor: pointer;
`;
