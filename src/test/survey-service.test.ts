import { SurveyService } from "../service/survey.service";
import { Database } from "../Data/database";
import { SurveyEntity } from "../Data/models/survey.entity";
import { QuestionEntity } from "../Data/models/question.entity";
import { QuestionsOptionsEntity } from '../Data/models/questions_options.entity';

jest.mock('../Data/database');

describe('SurveyService', () => {
    let service: SurveyService;
    let mockSaveSurvey: jest.Mock;
    let mockSaveQuestion: jest.Mock;
    let mockSaveOption: jest.Mock;
    let mockFindOne: jest.Mock;
    let mockFindAndCount: jest.Mock;
    let mockRemove: jest.Mock;
    let mockGetRepository: jest.Mock;


    beforeEach(() => {
        mockSaveSurvey = jest.fn();
        mockSaveQuestion = jest.fn();
        mockSaveOption = jest.fn();
        mockFindOne = jest.fn();
        mockFindAndCount = jest.fn();
        mockRemove = jest.fn();
    
  

        mockGetRepository = jest.fn().mockImplementation((entity: any) => {
            switch (entity) {
                case SurveyEntity:
                    return { save: mockSaveSurvey, findOne: mockFindOne, findAndCount: mockFindAndCount, remove: mockRemove };
                case QuestionEntity:
                    return { save: mockSaveQuestion, remove: mockRemove };
                case QuestionsOptionsEntity:
                    return { save: mockSaveOption, remove: mockRemove };
                default:
                    throw new Error('Unknown repository');
            }
        });

        (Database.getInstance as jest.Mock) = jest.fn().mockReturnValue({
            getRepository: mockGetRepository,
        });

        service = new SurveyService();
    });

    test('should create a survey', async () => {
        const surveyData = {
            title: 'Test Survey',
            description: 'Survey description',
            questions: [
                {
                    questionText: 'What is your favorite color?',
                    questionType: 'multiple_choice',
                    isRequired: true,
                    options: ['Red', 'Blue']
                }
            ],
            createdUserId: 1
        };
    
        const survey = new SurveyEntity();
        survey.title = surveyData.title;
        survey.description = surveyData.description;
        survey.createdUserId = surveyData.createdUserId;
    
        const question = new QuestionEntity();
        const option = new QuestionsOptionsEntity();
    
        mockSaveSurvey.mockResolvedValue(survey);
        mockSaveQuestion.mockResolvedValue(question);
        mockSaveOption.mockResolvedValue(option);
    
        const result = await service.createSurvey(surveyData);
    
        expect(result).toEqual(expect.objectContaining({
            title: surveyData.title,
            description: surveyData.description,
            createdUserId: surveyData.createdUserId
        }));
    });

    test('should update survey', async () => {
        const id = 1;
        const data = {
            title: 'Updated Survey',
            description: 'Updated description',
            questions: []
        };
        const survey = new SurveyEntity();
        survey.questions = [];  
        mockFindOne.mockResolvedValue(survey);
        mockSaveSurvey.mockResolvedValue(survey);
    
        const result = await service.updateSurvey(id, data);
    
        expect(result).toEqual(survey);
        expect(mockSaveSurvey).toHaveBeenCalledWith(expect.objectContaining({
            title: data.title,
            description: data.description
        }));
    });

    test('should delete survey', async () => {
        const id = 1;
        const survey = new SurveyEntity();
        survey.questions = [];  
        mockFindOne.mockResolvedValue(survey);
        mockRemove.mockResolvedValue(survey);
    
        const result = await service.delteSurvey(id);
    
        expect(result).toEqual(survey);
        expect(mockRemove).toHaveBeenCalled();
    });

    test('should return surveys by user id with pagination', async () => {
        const userId = 1;
        const surveys = [new SurveyEntity()];
        const total = 1;
        mockFindAndCount.mockResolvedValue([surveys, total]);

        const result = await service.getSurveyByUserId(userId, 1, 10);

        expect(result).toEqual({ surveys, total });
        expect(mockFindAndCount).toHaveBeenCalledWith({
            where: { createdUserId: userId },
            relations: ['questions', 'questions.options'],
            take: 10,
            skip: 0
        });
    });

    test('should return survey by id', async () => {
        const id = 1;
        const survey = new SurveyEntity();
        mockFindOne.mockResolvedValue(survey);

        const result = await service.getSurveyById(id);

        expect(result).toBe(survey);
        expect(mockFindOne).toHaveBeenCalledWith({
            where: { id },
            relations: ['questions', 'questions.options']
        });
    });

  
});