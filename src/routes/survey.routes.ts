import {Router, Request, Response} from 'express';
import { SurveyController } from '../controllers/survey.controller';


const surveyRouter = Router();
const surveyController = new SurveyController();

surveyRouter.get('/test-service', (request: Request, response:Response) =>{
    response.json({ message: 'Welcome to Survey-API'})
});

surveyRouter.post('/', (request: Request, response: Response)=>{
    surveyController.createSurvey(request, response);
});

surveyRouter.get('/:id', (request: Request, response: Response)=>{
  surveyController.getSurvey(request, response);
});


surveyRouter.put('/:id', (request: Request, response: Response)=>{
    surveyController.updateSurvey(request, response);
});

surveyRouter.delete('/:id', (request: Request, response: Response)=>{
    surveyController.deleteSurvey(request, response);
});

export default surveyRouter;