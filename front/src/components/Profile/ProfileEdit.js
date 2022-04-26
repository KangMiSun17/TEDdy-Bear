import React, {useState, useContext} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { DispatchContext, UserStateContext } from "../../App";
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function ProfileEdit({open, handleClose}) {
    const topTopics = ["기술", "과학", "문화", "글로벌이슈", "사회", "디자인", "사회변화", "비즈니스", "애니메이션", "건강"];
    const age = ["비밀", "10대", "20대", "30대", "40대", "50대", "60대", "70대", "80대", "90대", "100이상"]
    const topicDict = {
        기술: "technology",
        과학: "science",
        문화: "culture",
        글로벌이슈: "globalissues",
        사회: "society",
        디자인: "design",
        사회변화: "socialchange",
        비즈니스: "business",
        애니메이션: "animation",
        건강: "health",
    };

    const topicDict2 = {
        "technology":"기술",
        "science":"과학",
        "culture":"문화",
        "globalissues":"글로벌이슈",
        "society":"사회",
        "design":"디자인",
        "socialchange":"사회변화",
        "business":"비즈니스",
        "animation":"애니메이션",
        "health":"건강",
    };

    const userState = useContext(UserStateContext);
    const dispatch = useContext(DispatchContext);

    const [modifyUser, setModifyUser] = useState({
        name:userState.user.name,
        bearName:userState.user.bearName,
        myTopics:userState.user.myTopics.map((topic) => topicDict2[topic]),
        age:"",
        job:"",
        gender:"남",
    });
    return (
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              회원 정보 수정
            </Typography>
            <TextField
              label="변경할 유저 이름"
              value={modifyUser.name}
              onChange={(e) => {
                setModifyUser((cur) => {
                  const newData = { ...cur };
                  newData.name = e.target.value;
                  return newData;
                });
              }}
            />
            <TextField
              label="변경할 곰 이름"
              value={modifyUser.bearName}
              onChange={(e) => {
                setModifyUser((cur) => {
                  const newData = { ...cur };
                  newData.bearName = e.target.value;
                  return newData;
                });
              }}
            />
            <Autocomplete
              multiple
              id="tags-outlined"
              options={topTopics}
              value={modifyUser.myTopics}
              onChange={(event, newValue) => {
                setModifyUser((cur) => {
                  const newData = { ...cur };
                  newData.myTopics = newValue;
                  return newData;
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="주제"
                  placeholder="고르지 않으셔도 돼요 :)"
                />
              )}
            />
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={age}
              sx={{ width: 300 }}
              value={modifyUser.age}
              onChange={(event, newValue) => {
                setModifyUser((cur) => {
                  const newData = { ...cur };
                  newData.age = newValue;
                  return newData;
                });
              }}
              renderInput={(params) => <TextField {...params} label="나이" />}
            />
            <TextField
              label="직업"
              value={modifyUser.job}
              onChange={(e) => {
                setModifyUser((cur) => {
                  const newData = { ...cur };
                  newData.job = e.target.value;
                  return newData;
                });
              }}
            />
            {/* <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={["남", "여"]}
              sx={{ width: 300 }}
              value={modifyUser.gender}
              onChange={(event, newValue) => {
                setModifyUser((cur) => {
                  const newData = { ...cur };
                  newData.gender = newValue;
                  return newData;
                });
              }}
              renderInput={(params) => <TextField {...params} label="성별" />}
            /> */}
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                성별
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
              >
                <FormControlLabel
                  value="남"
                //   control={<Radio checked={modifyUser.gender === "남"}/>}
                control={<Radio/>}
                  label="남"
                  onClick={(e) => {
                    setModifyUser((cur) => {
                        const newData = {...cur};
                        newData.gender = e.target.value;
                        return newData;
                    })
                  }}
                />
                <FormControlLabel
                  value="여"
                //   control={<Radio checked={modifyUser.gender === "여"}/>}
                  control={<Radio/>}
                  label="여"
                  onClick={(e) => {
                    setModifyUser((cur) => {
                        const newData = {...cur};
                        newData.gender = e.target.value;
                        return newData;
                    })
                  }}
                />
              </RadioGroup>
            </FormControl>
          </Box>
        </Modal>
      </div>
    );
}

export default ProfileEdit;