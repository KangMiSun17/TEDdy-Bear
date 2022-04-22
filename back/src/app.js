import express from 'express';
import { swaggerUi, specs } from './modules/swagger';
import cors from 'cors';
import { userAuthRouter } from './routers/userRouter';
import { dataRouter } from './routers/dataRouter';
import { errorMiddleware } from './middlewares/errorMiddleware';

const app = express();

// swagger setting
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);

// CORS 에러 방지
app.use(cors());

// express 기본 제공 middleware
// express.json(): POST 등의 요청과 함께 오는 json형태의 데이터를 인식하고 핸들링할 수 있게 함.
// express.urlencoded: 주로 Form submit 에 의해 만들어지는 URL-Encoded 형태의 데이터를 인식하고 핸들링할 수 있게 함.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//기본 페이지
app.get('/', (req, res) => {
  res.send('TeDdy Bear 서비스입니다!');
});

app.use(userAuthRouter);
app.use(dataRouter);
app.use(errorMiddleware);

export { app };