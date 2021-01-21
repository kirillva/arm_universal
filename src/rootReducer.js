import { combineReducers } from "redux";
import FormSlice from "components/form/FormSlice";
import ReduxFormSlice from "components/reduxForm/ReduxFormSlice";

export default combineReducers({
  form: FormSlice,
  reduxForm: ReduxFormSlice
});
