import React, { useState, useEffect, useContext } from "react";
import { UserStateContext } from "../../App";
import * as Api from "../../api";
import "./styles/lecture.css";
import DetailedIcons from "./DetailedIcons";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { brown } from "@mui/material/colors";
import { useParams } from "react-router-dom";
import Reply from "./Reply";

import {
  DescriptionText,
  TitleText,
  UserCommentText,
  UserNameText,
} from "./styles/Style";

function LectureExplanation() {
  const user = useContext(UserStateContext).user;
  const [cotton, setCotton] = useState();
  const params = useParams();
  const [commentList, setCommentList] = useState([]);
  const [view, setView] = useState(0);

  const [comment, setComment] = useState(() => {
    if (user === null) {
      return true;
    } else {
      return false;
    }
  });
  const [userComment, setUserComment] = useState("");
  const talkId = params.talkId;
  const [lecture, setLecture] = useState({});
  const customFetcher = (url) => {
    if (url !== undefined) {
      fetch(`https://rlp-proxy.herokuapp.com/v2?url=${url}`)
        .then((res) => res.json())
        .then((json) =>
          setLecture((cur) => {
            const newData = { ...cur };
            newData["image"] = json.metadata.image;
            return newData;
          })
        );
    }
  };

  const makeSpeaker = (speakers) => {
    if (speakers !== undefined) {
      if (speakers.length === 1) {
        return speakers;
      } else {
        return speakers.join(", ");
      }
    }
  };

  const handleWatch = async () => {
    const data = {
      user_id: user.id,
      talkId: talkId,
    };
    setCotton((cur) => cur + 1);
    if (user.alert) {
      alert("솜 하나를 받았습니다!");
    }
    window.open(lecture.url, "_blank");
    setView((cur) => cur + 1);
    await Api.post("viewhistory/create", data);
    await Api.put(`users/${user.id}`, {
      cotton: cotton,
    });
  };

  useEffect(() => {
    const fetchTalks = async () => {
      const res = await Api.get(`talks`, `${talkId}`);
      setLecture(res.data);
      customFetcher(res.data.url);
      setView(res.data.teddy_view_count);
    };
    const fetchCotton = async () => {
      const res = await Api.get(`users/${user.id}`);
      setCotton(res.data.cotton);
    };
    fetchTalks();
    fetchCotton();
  }, [talkId]);

  useEffect(() => {
    Api.get(`talks/${talkId}/comments`).then((res) => {
      setCommentList(res.data.payload);
    });
  }, [talkId]);

  const handleCommentWrite = () => {
    const data = {
      mode: "comment",
      talkId: talkId,
      comment: userComment,
    };
    Api.post("comments/comment", data).then((res) => {
      Api.get(`talks/${talkId}/comments`).then((res) => {
        setCommentList(res.data.payload);
      });
    });
    setUserComment("");
  };

  const handleReplyDelete = (e) => {
    const num = e.target.name;
    const commentIndex = Number(num[0]);
    const replyIndex = Number(num[1]);
    Api.delete(
      `comments/${commentList[commentIndex].reply[replyIndex]._id}?mode=reply`
    ).then((res) => {
      Api.get(`talks/${talkId}/comments`).then((res) => {
        setCommentList(res.data.payload);
      });
    });
  };

  return (
    <div className="infobox">
      <div className="lecturebox" style={{ marginTop: 100, marginBottom: 30 }}>
        <img className="lectureimg" src={lecture.image} alt="lecture img" />
      </div>
      <div className="buttoncontent lecturebox" style={{ marginBottom: 30 }}>
        {Object.keys(lecture).length !== 0 && (
          <DetailedIcons lecture={lecture} view={view}></DetailedIcons>
        )}
        <GoButton onClick={handleWatch}>영상 시청하러 가기</GoButton>
      </div>
      <div className="descriptionbox lecturebox">
        <TitleText>제목</TitleText>
        <DescriptionText>{lecture.title}</DescriptionText>
      </div>
      <div className="descriptionbox lecturebox">
        <TitleText>강연자</TitleText>
        <DescriptionText>{makeSpeaker(lecture.speakers)}</DescriptionText>
      </div>
      <div className="descriptionbox lecturebox">
        <TitleText>요약</TitleText>
        <DescriptionText>{lecture.description}</DescriptionText>
      </div>
      <div className="descriptionbox lecturebox">
        <TitleText>주제</TitleText>
        <DescriptionText>{makeSpeaker(lecture.topics)}</DescriptionText>
      </div>
      <div className="descriptionbox lecturebox">
        <TitleText>리뷰</TitleText>
      </div>

      <div className="commentbox lecturebox">
        {commentList.length !== 0 &&
          commentList.map((usercomment, index) => (
            <div key={index} style={{ marginTop: "10px" }}>
              <div className="comment">
                <UserNameText>{usercomment.user.name}</UserNameText>
                <UserCommentText>{usercomment.comment}</UserCommentText>
                <Reply
                  talkId={talkId}
                  parentCommentId={usercomment._id}
                  setCommentList={setCommentList}
                  index={index}
                  comment={comment}
                  commentList={commentList}
                  usercomment_id={usercomment.user._id}
                ></Reply>
              </div>
              {usercomment.reply.length !== 0 &&
                usercomment.reply.map((reply, i) => (
                  <div key={i}>
                    <div
                      style={{
                        width: "100%",
                        minHeight: `${
                          reply.user._id === user._id ? "120px" : "70px"
                        }`,
                        display: "flex",
                        marginTop: "5px",
                      }}
                    >
                      <div
                        style={{
                          width: "10%",
                          height: "70px",
                          display: "flex",
                        }}
                      >
                        <div
                          style={{
                            width: "50%",
                            height: "35px",
                          }}
                        ></div>
                        <div
                          style={{
                            width: "50%",
                            height: "35px",
                            borderLeft: "2px dotted black",
                            borderBottom: "2px dotted black",
                          }}
                        ></div>
                      </div>
                      <div className="reply">
                        <UserNameText>{reply.user.name}</UserNameText>
                        <DescriptionText>{reply.comment}</DescriptionText>
                        <div style={{ textAlign: "right" }}>
                          {reply.user._id === user._id && (
                            <GoButton
                              name={`${index}${i}`}
                              style={{ marginRight: "10px" }}
                              onClick={handleReplyDelete}
                            >
                              삭제
                            </GoButton>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ))}
      </div>
      <textarea
        disabled={comment}
        value={userComment}
        onChange={(e) => setUserComment(e.target.value)}
        wrap="on"
      ></textarea>
      <div className="lecturebox" style={{ marginTop: 20, textAlign: "right" }}>
        <GoButton disabled={comment} onClick={handleCommentWrite}>
          리뷰 쓰기
        </GoButton>
      </div>
    </div>
  );
}

const GoButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(brown[500]),
  backgroundColor: brown[500],
  width: "10vw",
  "&:hover": {
    backgroundColor: brown[700],
  },
}));

export default LectureExplanation;
