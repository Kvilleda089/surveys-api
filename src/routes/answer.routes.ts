import { Router, Response, Request } from 'express';
import { AnswerController } from '../controllers/answer.controller';



const answerRoutes = Router();
const answerController = new AnswerController();


answerRoutes.post('/', (request: Request, response: Response) =>{
    answerController.createAnswer(request, response);
});

answerRoutes.get('/:answerId/surveys/:suverId', (request: Request, response: Response)=>{
    answerController.getAnswers(request, response);
});

answerRoutes.put('/:id', (request: Request, response: Response)=>{
    answerController.updateAnswers(request, response);
});

answerRoutes.delete('/:id', (request: Request, response: Response)=>{
    answerController.deleteAnswers(request, response);
});






export default answerRoutes;