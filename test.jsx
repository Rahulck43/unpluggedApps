import React, { useState } from 'react';
import './App.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select'

function App() {


  const [itemCodes] = useState([
    { value: '001', label: 'Item 001' },
    { value: '002', label: 'Item 002' },
    // Add more item codes as needed
  ]);

  const formik = useFormik({
    initialValues: {
      header: {
        voucherNo: '',
        date: '',
        accountName: '',
        status: '',
        accountAmount: '',
      },
      items: [
        { srNo: '', itemCode: '', itemName: '', quantity: '', rate: '', totalAmount: '' },
        // initial item row
      ],
      totalAmount: '',
    },

    validationSchema: Yup.object({
      header: Yup.object({
        voucherNo: Yup.number('should be number').required('Required'),
        date: Yup.string().required('Required'),
        accountName: Yup.string('only alphabets allowed').required('Required'),
        status: Yup.string().required('Required'),
        accountAmount: Yup.string().required('Required'),
      }),
      items: Yup.array().of(
        Yup.object({
          srNo: Yup.number('only number allowed').required('Required'),
          itemCode: Yup.string().required('Required'),
          itemName: Yup.string().required('Required'),
          quantity: Yup.number('only number allowed').required('Required'),
          rate: Yup.number('only number allowed').required('Required'),
          totalAmount: Yup.string().required('Required'),
        })
      ),
      totalAmount: Yup.string().required('Required'),
    }),
    
  });
  const getFieldError = (fieldName) => {
    return formik.touched[fieldName] && formik.errors[fieldName];
  };


  const handleItemCodeChange = (value, index) => {
    const selectedItem = itemCodes.find((item) => item.value === value);
    formik.setFieldValue(`items.${index}.itemCode`, value);
    formik.setFieldValue(`items.${index}.itemName`, selectedItem ? selectedItem.label : '');
  };

  const handleRemoveItem = (index) => {
    if(index===0 && formik.values.items.length===1){
      return
    }
    formik.setFieldValue('items', formik.values.items.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    await formik.handleSubmit();
    console.log('Form values after save:', formik.values);
  };



  return (
    <>
     <form onSubmit={formik.handleSubmit}>
      <div className="flex flex-col h-screen">

        {/* Upper part takes 30% height and full width */}
        <div className="h-30 bg-blue-500 flex flex-col items-center justify-center p-14">

          <div className="flex space-x-4 mb-4">
            {/* Label for Vr no */}
            <label htmlFor="vrNo">Vr no</label>
            <input
                type="text"
                id="vrNo"
                name="header.voucherNo"
                className={`border p-2 rounded-md h-8 ${getFieldError('header.voucherNo') ? 'border-red-500' : ''}`}
                value={formik.values.header.voucherNo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {getFieldError('header.voucherNo') && (
                <div className="text-red-500">{getFieldError('header.voucherNo')}</div>
              )}
            {/* Label for Vr date */}
            <label htmlFor="vrDate">Vr date</label>
            <input
              type="text"
              id="vrDate"
              readOnly
              value={new Date().toLocaleDateString('en-GB')}
              className="border p-2 rounded-md h-8 w-28"
              onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            />

            {/* Label for Dropdown */}
            <label htmlFor="aiOptions">Status</label>
            <select id="aiOptions" className="border p-2 rounded-md "
            onChange={(e) => formik.setFieldValue('header.status', e.target.value)}>
              <option value="optionA" className='h-1'>A</option>
              <option value="optionI">I</option>
            </select>

          </div>

          <div className="flex space-x-4 mt-3" >
            {/* Label for Account Name */}
            <label htmlFor="accountName">Account Name</label>
            <input
              type="text"
              id="accountName"
              className="border p-2 rounded-md h-8 w-48"
              onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            />
            
            {getFieldError('header.accountName') && (
      <div className="text-red-500">{getFieldError('header.accountName')}</div>
    )}

            {/* Label for Account Amount */}
            <label htmlFor="accountAmount">Account Amount</label>
            <input
              type="text"
              id="accountAmount"
              name="header.accountAmount"  
              className="border p-2 rounded-md h-8 w-24"
            />
          </div>

        </div>

        {/* Lower part takes remaining height */}
        <div className="flex-grow bg-green-500 p-4">


          <div >
            <table>
              <thead>
                <tr>
                  <th>Sr No</th>
                  <th>Item Code</th>
                  <th>Item Name</th>
                  <th>Quantity</th>
                  <th>Rate</th>
                  <th>Total Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {formik.values.items.map((item, index) => (
                  <tr key={index} >
                    <td>
                      <input
                        className='h-8 rounded-sm'
                        type="text"
                        name={`items.${index}.srNo`}
                        value={item.srNo}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />


                    </td>
                    <td >
                      <Select className='border rounded-md '
                        name={`items.${index}.itemCode`}
                        options={itemCodes}
                        value={itemCodes.find((option) => option.value === `${item.itemCode}`)}
                        onChange={(selectedOption) =>
                          handleItemCodeChange(selectedOption.value, index)
                        }
                      />

                     
                    </td>
                    <td>
                      <input
                        type="text"
                        className='h-8 rounded-sm'

                        name={`items.${index}.itemName`}
                        value={item.itemName}
                        onChange={formik.handleChange}
                        readOnly
                      />
                     
                    </td>
                    <td>
                      <input
                        className='h-8 rounded-sm'

                        type="text"
                        name={`items.${index}.quantity`}
                        value={item.quantity}
                        onChange={formik.handleChange}
                      />
                     
                    </td>
                    <td>
                      <input
                        className='h-8 rounded-sm'

                        type="text"
                        name={`items.${index}.rate`}
                        value={item.rate}
                        onChange={formik.handleChange}
                      />
                     
                    </td>
                    <td>
                      <input
                        className='h-8 rounded-sm'
                        type="text"
                        name={`items.${index}.totalAmount`}
                        readOnly
                        value={item?.quantity && item.rate ? (parseFloat(item.quantity) * parseFloat(item.rate)).toFixed(2) : 0}
                        onChange={formik.handleChange}
                      />
                     
                    </td>
                    <td>
                      {formik.values.items.length > 0 &&

                        <button type="button" onClick={() => handleRemoveItem(index)}>
                          Remove
                        </button>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button type="button" onClick={() => formik.setFieldValue('items', [...formik.values.items, { srNo: '', itemCode: '', itemName: '', quantity: '', rate: '', totalAmount: '' }])}>
              Add Item
            </button>
            <button type="button" onClick={handleSave}>
            Save
          </button>
          </div>



        </div>

      </div>
      </form>
    </>
  );
}

export default App;
