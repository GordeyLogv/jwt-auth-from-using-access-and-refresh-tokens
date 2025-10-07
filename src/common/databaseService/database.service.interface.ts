export interface IDatabaseService {
  onModuleInit: () => Promise<void>;
  onModuleDestroy: () => Promise<void>;
}
