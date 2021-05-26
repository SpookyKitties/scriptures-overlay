import { BehaviorSubject } from 'rxjs';
import { Chapter } from './models/Chapter/Chapter';

export const chapter$ = new BehaviorSubject<Chapter | undefined>(undefined);
