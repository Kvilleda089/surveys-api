import { Request, Response } from "express";
import { SurveyService } from '../service/survey.service';


const surveyService = new SurveyService();

export class SurveyController {

    public async createSurvey(request: Request, response: Response): Promise<Response> {
        try {
            const survey = await surveyService.createSurvey(request.body);
            return response.status(201).json(survey);
        } catch (error) {
            console.log(error);
            return response.status(500).json({ message: `Error creating survey` })
        };
    };

    public async getSurvey(request: Request, response: Response): Promise<Response> {
        try {
            const { id } = request.params;
            const survey = await surveyService.getSurveyById(Number(id));
            if (!survey) {
                return response.status(204).json({ message: 'Survey not found' });
            }
            return response.status(200).json(survey);
        } catch (error) {
            return response.status(500).json({ message: `Error: ${error}` });
        };
    };

    public async getSurveyByUserId(request: Request, response: Response): Promise<Response> {
        try {
            const { createdUserId } = request.query;
            const page = parseInt(request.query.page as string, 10) || 1;
            const pageSize = parseInt(request.query.pageSize as string, 10) || 10;
    
            if (!createdUserId) {
                return response.status(400).json({ message: 'createdUserId is required' });
            }
            const { surveys, total } = await surveyService.getSurveyByUserId(
                Number(createdUserId), 
                page,
                pageSize
            );
    
            if (!surveys.length) {
                return response.status(204).json({ message: 'No surveys found' });
            }
    
            return response.status(200).json({ surveys, total });
        } catch (error) {
            return response.status(500).json({ message: `Error: ${error}` });
        }
    } 

    public async updateSurvey(request: Request, response: Response): Promise<Response> {
        try {
            const { id } = request.params;
            const survey = await surveyService.updateSurvey(Number(id), request.body);

            if (!survey) {
                return response.status(204).json({ message: 'Survey not found' });
            }

            return response.status(201).json({ message: `Updated survey ${id}`, survey })
        } catch (error) {
            return response.status(500).json({ message: `Error: ${error}` });

        }
    };

    public async deleteSurvey(request: Request, response: Response): Promise<Response> {
        try {
            const { id } = request.params;
            const survey = await surveyService.delteSurvey(Number(id));

            if (!survey) {
                return response.status(204).json({ message: 'Survey not found' })
            }
            return response.status(200).json({ message: `Deleted success`, survey })
        } catch (error) {
            return response.status(500).json({ message: `Error: ${error}` });
        }
    }

}