import { combineReducers } from 'redux';

import user from './user';
import postcards from './postcards';
import balance from './balance';
import production from './production';
import sales from './sales';
import employee from './employee';
import clients from './clients';
import app from './app';

export default combineReducers({
  user,
  balance,
  production,
  sales,
  employee,
  clients,
  postcards,
  app
});