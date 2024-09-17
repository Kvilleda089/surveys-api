import { SurveyEntity } from '../Data/models/survey.entity';
import { UserEntity } from '../Data/models/user.entity';
import { AnswerEntity } from '../Data/models/answer.entity';
import { QuestionEntity } from '../Data/models/question.entity';
import { AnswerDetailEntity } from '../Data/models/answer-detail.entity';
import { AnswerService } from '../service/answer.service';
import { QuestionsOptionsEntity } from '../Data/models/questions_options.entity';
import { Database } from '../Data/database';
import { PathParams } from '@service/interface/path-params';


jest.mock('../Data/database');
const mockGetRepository = jest.fn();
(Database.getInstance as jest.Mock).mockReturnValue({
    getRepository: mockGetRepository,
});

describe('AnswerService', () => {
    let service: AnswerService;
    let mockAnswerRepository: any;
    let mockSurveyRepository: any;
    let mockUserRepository: any;
    let mockAnswerDetailRepository: any;
    let mockQuestionRepository: any;
    let mockQuestionOptionRepository: any;

    beforeEach(() => {
        mockAnswerRepository = { 
            save: jest.fn(),  
            findOne: jest.fn(),
            remove: jest.fn(),
           findAndCount: jest.fn()
        };
        mockSurveyRepository = { findOne: jest.fn() };
        mockUserRepository = { findOne: jest.fn() };
        mockAnswerDetailRepository = { save: jest.fn(), remove: jest.fn(), };
        mockQuestionRepository = {
             findOne: jest.fn(), 
             remove: jest.fn(), 
             save: jest.fn() 
            };
        mockQuestionOptionRepository = { 
            findOne: jest.fn(), 
            remove: jest.fn(), 
            save: jest.fn() 
        };

        mockGetRepository.mockImplementation((entity: any) => {
            switch (entity) {
                case AnswerEntity:
                    return mockAnswerRepository;
                case SurveyEntity:
                    return mockSurveyRepository;
                case UserEntity:
                    return mockUserRepository;
                case AnswerDetailEntity:
                    return mockAnswerDetailRepository;
                case QuestionEntity:
                    return mockQuestionRepository;
                case QuestionsOptionsEntity:
                    return mockQuestionOptionRepository;
                default:
                    throw new Error('Unexpected repository');
            }
        });

        service = new AnswerService();
    });

    test('should save answers successfully', async () => {
        const survey = new SurveyEntity();
        const user = new UserEntity();
        const savedAnswer = new AnswerEntity();
        const question = new QuestionEntity();
        const questionOption = new QuestionsOptionsEntity();
        const answerDetail = new AnswerDetailEntity();
    
       
        mockSurveyRepository.findOne.mockResolvedValue(survey);
        mockUserRepository.findOne.mockResolvedValue(user);
        mockAnswerRepository.save.mockResolvedValue(savedAnswer);
        mockQuestionRepository.findOne.mockResolvedValue(question);
        mockQuestionOptionRepository.findOne.mockResolvedValue(questionOption); 
        mockAnswerDetailRepository.save.mockResolvedValue(answerDetail);
    
        const data = [
            {
                question: 1,
                questionOption: 1,
                textAnswer: 'Sample answer',
            },
        ];
    
        const result = await service.saveAnswers(1, 1, data);
    
        expect(result).toBe(savedAnswer);
        expect(mockAnswerRepository.save).toHaveBeenCalledWith(expect.any(AnswerEntity));
        expect(mockAnswerDetailRepository.save).toHaveBeenCalled();
    });

    test('should return null if survey or user is not found', async () => {
        mockSurveyRepository.findOne.mockResolvedValue(null);
        const result = await service.saveAnswers(1, 1, []);
        expect(result).toBeNull();
    });

    test('should throw an error if question is not found', async () => {
      
        mockSurveyRepository.findOne.mockResolvedValue(new SurveyEntity());
        mockUserRepository.findOne.mockResolvedValue(new UserEntity());
        mockQuestionRepository.findOne.mockResolvedValue(null); 
        mockAnswerRepository.save.mockResolvedValue(new AnswerEntity());
        mockAnswerDetailRepository.save.mockResolvedValue(new AnswerDetailEntity());

        const data = [
            {
                question: 12,
                questionOption: 1,
                textAnswer: 'Sample answer',
            },
        ];

        await expect(service.saveAnswers(1, 1, data))
            .rejects
            .toThrow('Question with ID 12 not found');
    });

    test('should throw an error if question option is not found', async () => {
       
        const survey = new SurveyEntity();
        const user = new UserEntity();
        const question = new QuestionEntity();
        const savedAnswer = new AnswerEntity();
        const answerDetail = new AnswerDetailEntity();
        question.id = 2;
        mockSurveyRepository.findOne.mockResolvedValue(survey);
        mockUserRepository.findOne.mockResolvedValue(user);
        mockQuestionRepository.findOne.mockResolvedValue(question); 
        mockQuestionOptionRepository.findOne.mockResolvedValue(null); 
        mockAnswerRepository.save.mockResolvedValue(savedAnswer);
        mockAnswerDetailRepository.save.mockResolvedValue(answerDetail);

        const data = [
            {
                question: 2,
                questionOption: 12, 
                textAnswer: 'Sample answer',
            },
        ];

        await expect(service.saveAnswers(1, 1, data))
            .rejects
            .toThrow('Option with ID 12 not found for question 2');
    });

    test('should return null if survey is not found', async () => {
        
        mockSurveyRepository.findOne.mockResolvedValue(null);
        const result = await service.getAnswer(1, 1);
        expect(result).toBeNull();
    });

    test('should return null if answer is not found', async () => {
        const survey = new SurveyEntity();
        mockSurveyRepository.findOne.mockResolvedValue(survey);
        mockAnswerRepository.findOne.mockResolvedValue(null);

        const result = await service.getAnswer(1, 1);
        expect(result).toBeNull();
    });

    test('should return the answer with all relations loaded', async () => {
        const survey = new SurveyEntity();
        const answer = new AnswerEntity();
        const question = new QuestionEntity();
        const questionOption = new QuestionsOptionsEntity();

        mockSurveyRepository.findOne.mockResolvedValue(survey);

        mockAnswerRepository.findOne.mockResolvedValue({
            ...answer,
            details: [
                {
                    question,
                    questionOption,
                    textAnswer: 'Sample answer',
                }
            ],
        });

        const result = await service.getAnswer(1, 1);

        expect(result).toBeDefined();
        expect(result).toHaveProperty('details');
        expect(result?.details[0]).toHaveProperty('question');
        expect(result?.details[0]).toHaveProperty('questionOption');
        expect(result?.details[0]).toHaveProperty('textAnswer');
    });

    test('should return null if answer is not found', async () => {
        mockAnswerRepository.findOne.mockResolvedValue(null);

        const result = await service.deleteAnswer(1);
        expect(result).toBeNull();
    });

    test('should delete the answer and its details if found', async () => {
        const answer = new AnswerEntity();
        answer.details = [new AnswerDetailEntity(), new AnswerDetailEntity()]; 

        mockAnswerRepository.findOne.mockResolvedValue(answer);
        mockAnswerRepository.remove.mockResolvedValue(answer);
        mockAnswerDetailRepository.remove.mockResolvedValue(undefined); 

        const result = await service.deleteAnswer(1);

        expect(result).toBe(answer);
        expect(mockAnswerRepository.findOne).toHaveBeenCalledWith({
            where: { id: 1 },
            relations: ['details']
        });
        expect(mockAnswerDetailRepository.remove).toHaveBeenCalledWith(answer.details);
        expect(mockAnswerRepository.remove).toHaveBeenCalledWith(answer);
    });

    it('should delete the answer if it has no details', async () => {
        const answer = new AnswerEntity();
        answer.details = []; 

        mockAnswerRepository.findOne.mockResolvedValue(answer);
        mockAnswerRepository.remove.mockResolvedValue(answer);

        const result = await service.deleteAnswer(1);

        expect(result).toBe(answer);
        expect(mockAnswerDetailRepository.remove).not.toHaveBeenCalled(); 
        expect(mockAnswerRepository.remove).toHaveBeenCalledWith(answer);
    });

    test('should return answers and total count', async () => {
        const answers = [new AnswerEntity(), new AnswerEntity()];
        const total = 2;

        mockAnswerRepository.findAndCount.mockResolvedValue([answers, total]);

        const data: PathParams = { userId: 1, surveId: 1, page: 1, pageSize: 10 };
        const result = await service.getAnswerByUserIdAndSurveyId(data);

        expect(result).toEqual({ answers, total });
        expect(mockAnswerRepository.findAndCount).toHaveBeenCalledWith({
            where: { modifiedUser: { id: 1 }, survey: { id: 1 } },
            relations: ['survey', 'modifiedUser', 'details', 'details.question', 'details.questionOption'],
            take: 10,
            skip: 0
        });
    });

    it('should handle pagination correctly', async () => {
        const answers = [new AnswerEntity()];
        const total = 1;

        mockAnswerRepository.findAndCount.mockResolvedValue([answers, total]);

        const data: PathParams = { userId: 1, surveId: 1, page: 2, pageSize: 5 };
        const result = await service.getAnswerByUserIdAndSurveyId(data);

        expect(result).toEqual({ answers, total });
        expect(mockAnswerRepository.findAndCount).toHaveBeenCalledWith({
            where: { modifiedUser: { id: 1 }, survey: { id: 1 } },
            relations: ['survey', 'modifiedUser', 'details', 'details.question', 'details.questionOption'],
            take: 5,
            skip: 5
        });
    });

    test('should return null if answer is not found', async () => {
        mockAnswerRepository.findOne.mockResolvedValue(null);

        const result = await service.deleteAnswer(1);

        expect(result).toBeNull();
        expect(mockAnswerDetailRepository.remove).not.toHaveBeenCalled();
        expect(mockAnswerRepository.remove).not.toHaveBeenCalled();
    });

});