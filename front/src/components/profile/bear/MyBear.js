import { useContext, useEffect, useState } from "react";
import { BearImg, BearInfo, BearPage, MyPageText } from "../styles/Style";
import ExpBar from "./ExpBar";
import * as Api from "../../../api";
import { MyButton } from "../../common/MyButton";
import { UserStateContext } from "../../../App";

/** my bear page component
 *
 * @param {object} param0
 * @returns {component} my bear page
 */
function MyBear({ user }) {
  const userState = useContext(UserStateContext);
  const [bear, setBear] = useState({});
  console.log(user);
  let maxExp = bear.level * 10;
  const [progress, setProgress] = useState(bear.exp / maxExp);

  useEffect(() => {
    if (user.id === userState.user.id) {
      setBear({
        cotton: user.cotton,
        height: user.height,
        level: user.level,
        exp: user.exp,
      });
    }
  }, [
    user.id,
    userState.user.id,
    user.cotton,
    user.height,
    user.level,
    user.exp,
  ]);

  //server bear data update
  const fetchBear = async () => {
    await Api.put(`users/${user.id}`, {
      cotton: bear.cotton,
      level: bear.level,
      height: bear.height,
      exp: bear.exp,
    });
  };

  //if exp full, execute a function
  useEffect(() => {
    if (bear.exp === maxExp) {
      setProgress(0);
      setBear((cur) => ({
        ...cur,
        level: cur.level + 1,
        height: cur.height + 10,
        exp: 0,
      }));
      maxExp = bear.level * 10;
    }
    setProgress((bear.exp / maxExp) * 100);
    fetchBear();
  }, [bear.exp, bear.cotton]);

  //click button, execute a function
  const giveCotton = () => {
    if (bear.cotton === 0) {
      alert("솜이 부족합니다!");
      setBear((cur) => ({ ...cur, cotton: 0 }));
    } else {
      setBear((cur) => ({ ...cur, exp: cur.exp + 1, cotton: cur.cotton - 1 }));
    }
    fetchBear();
    return;
  };

  return (
    <BearPage>
      <BearImg src="/mybear.png" alt="bear" />
      <BearInfo>
        <MyPageText>LEVEL {bear.level}</MyPageText>
        <MyPageText>
          {bear.exp} / {maxExp}
        </MyPageText>
        <ExpBar value={progress} />
        <MyPageText>키 {bear.height} cm</MyPageText>
        <MyPageText>남은 솜 {bear.cotton}</MyPageText>
        <MyButton onClick={giveCotton}>솜 주기</MyButton>
      </BearInfo>
    </BearPage>
  );
}

export default MyBear;
