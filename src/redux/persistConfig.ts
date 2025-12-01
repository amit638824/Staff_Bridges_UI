import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { PersistConfig } from 'redux-persist';
import { RootState } from '@/redux/store';

export const persistConfig: PersistConfig<RootState> = {
  key: 'root',
  storage,
  whitelist: ['user'], // slices you want to persist
};
