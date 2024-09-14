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
            const survey = await surveyService.getSurvey(Number(id));
            if (!survey) {
                return response.status(204).json({ message: 'Survey not found' });
            }
            return response.status(200).json(survey);
        } catch (error) {
            return response.status(500).json({ message: `Error: ${error}` });
        };
    };

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