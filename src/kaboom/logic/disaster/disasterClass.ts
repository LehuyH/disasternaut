export default class Disaster<State = any>{
    constructor() { }
    public name?: string;
    public description?: string;
    public state?: State;
    public canceler?(): void;
    public exit?(): void;
    public init?(): void;
    public planet?(): void
    public interior?(): void;
}