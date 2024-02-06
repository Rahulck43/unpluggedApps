import * as Yup from 'yup'



const formValidation = Yup.object().shape({

    voucherNo: Yup.number().typeError('Should be a number').required('Required'),
    date: Yup.string(),
    status: Yup.string().required('Required'),
    accountName: Yup.string().matches(/^[a-zA-Z\s]*$/, 'Only alphabets allowed').required('Required'),
    accountAmount: Yup.number(),
    items: Yup.array().of(
        Yup.object({
            srNo: Yup.number(),
            itemCode: Yup.string().typeError('Should be a string'),
            itemName: Yup.string().typeError('Should be a string'),
            quantity: Yup.number().typeError('Enter valid number'),
            rate: Yup.number().typeError('Enter valid number'),
            totalAmount: Yup.number().typeError('Enter a valid number'),
        }))
})


export default formValidation