import { SettingsService } from '../../shared/';
import { PaginationService } from '../../core/';
import { ApplicationsService } from './applications.service';
import { Connection, Model, connect } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Task, TaskDocument, TaskSchema } from '../tasks/schemas';
import { TaskStub } from '../../test/stubs/';
import { Session, SessionDocument, SessionSchema } from '../sessions/schemas';

describe('ApplicationsService', () => {
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;

  let applicationsService: ApplicationsService;
  let settingsService: SettingsService;
  let paginationService: PaginationService;
  let taskModel: Model<Task>;
  let sessionModel: Model<Session>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    taskModel = mongoConnection.model('TaskData', TaskSchema);
    sessionModel = mongoConnection.model('SessionData', SessionSchema);

    settingsService = new SettingsService();
    paginationService = new PaginationService();

    applicationsService = new ApplicationsService(
      settingsService,
      paginationService,
      mongoConnection,
      {
        ...taskModel,
        collection: {
          collectionName: 'TaskData',
        },
      } as Model<TaskDocument>,
      {
        ...sessionModel,
        collection: {
          collectionName: 'SessionData',
        },
      } as Model<SessionDocument>
    );
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });

  afterEach(async () => {
    const collections = mongoConnection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  it('should be defined', () => {
    expect(applicationsService).toBeDefined();
  });

  it('should return an empty array when no tasks are found', async () => {
    const result = await applicationsService.findAll();
    expect(result).toEqual([]);
  });

  it('should return an array of applications with one element when one task is found', async () => {
    await taskModel.create(TaskStub);

    const result = await applicationsService.findAll();
    expect(result).toEqual([
      {
        _id: {
          applicationName: TaskStub.Options.Options.GridAppName,
          applicationVersion: TaskStub.Options.Options.GridAppVersion,
        },
        countTasksProcessing: 0,
        countTasksPending: 0,
        countTasksError: 0,
        countTasksCompleted: 1,
      },
    ]);
  });
});
