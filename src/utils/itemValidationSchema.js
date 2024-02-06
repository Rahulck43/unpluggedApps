// utils/validationSchemaItems.js
import * as Yup from 'yup';

const itemValidationSchema = Yup.object().shape({
  srNo: Yup.number(),
  itemCode: Yup.string().typeError('Should be a string').required('Required'),
  itemName: Yup.string().typeError('Should be a string').required('Required'),
  quantity: Yup.number().typeError('Enter valid number').required('Required'),
  rate: Yup.number().typeError('Enter valid number').required('Required'),
  totalAmount: Yup.number().typeError('Enter a valid number').required('Required'),
});

export default itemValidationSchema;
