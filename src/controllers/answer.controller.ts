import { AnswerService } from '../service/answer.service';
import { Request, Response } from 'express';


const answerService = new AnswerService()

export class AnswerController {


    public async createAnswer(request: Request, response: Response): Promise<Response> {
        try {
            const { surveyId, userId, responseBody } = request.body;
            const answer = await answerService.saveAnswers(surveyId, userId, responseBody);
            const responseData = {
                ...answer,
                modifiedUser: {
                    emai: answer?.modifiedUser.email
                }
            }
            return response.status(201).json(responseData);
        } catch (error) {
            return response.status(500).json({ message: `Error creating answer ${error}` })
        }
    }

    public async getAnswers(request: Request, response: Response): Promise<Response> {
        try {
            const { answerId, suverId, } = request.params;
            const answer = await answerService.getAnswer(Number(answerId), Number(suverId));

            if (!answer) {
                return response.status(204).json({ message: 'Answer not found' })
            }
            const responseData = {
                ...answer,
                modifiedUser: {
                    email: answer.modifiedUser.email
                }
            }
            return response.status(200).json(responseData);
        } catch (error) {
            return response.status(500).json({ message: `Error`, error })
        }
    };

    public async updateAnswers(request: Request, response: Response): Promise<Response> {
        try {
            const { id } = request.params;
            const answerUpdate = await answerService.updateAnswer(Number(id), request.body);

            if (!answerUpdate) {
                return response.status(204).json({ message: 'Answer not found' })
            }
            return response.status(200).json({ message: `Update Success `, answerUpdate })
        } catch (error) {
            return response.status(500).json({ message: `Error: ${error}` })
        }
    };

    public async deleteAnswers(request: Request, response: Response): Promise<Response> {
        try {
            const { id } = request.params;
            const answerDelete = await answerService.deleteAnswer(Number(id));

            if (!answerDelete) {
                return response.status(204).json({ message: 'Answer not found' });
            }

            return response.status(200).json(answerDelete);
        } catch (error) {
            return response.status(500).json({ message: `Error: ${error}` })
        }
    }
}