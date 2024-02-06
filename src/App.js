import React, { useEffect, useState,useRef} from 'react';
import './App.css';
import { useFormik } from 'formik';
import formValidation from './utils/validationSchema';
import Select from 'react-select'
import axios from 'axios';

function App() {
  const currentDate = new Date().toLocaleDateString('en-GB');
  const [itemCodes, setItemCodes] = useState([])
  const ref = useRef()

  useEffect(() => {
    fetch('http://5.189.180.8:8010/item')
      .then((response) => response.json())
      .then((data) => {
        setItemCodes(data)
      })
  }, [])

  const handlePrint=()=>{
    setTimeout(() => {
      window.print();
    }, 5);
  }


  const options = Array.isArray(itemCodes) ? (
    itemCodes.map((item) => ({ value: item.item_code, label: item.item_code, itemName: item.item_name }))
  ) : [];




  const handleItemCodeChange = (value, index) => {
    const selectedItem = itemCodes.find((item) => item.item_code === value);
    setFieldValue(`items.${index}.itemCode`, value || '');
    setFieldValue(`items.${index}.itemName`, selectedItem ? selectedItem.item_name : '');
  };

  const handleAddNewRow = () => {
    const isExistingRowsFilled = values.items.every(
      (item) =>
        item.srNo &&
        item.itemCode &&
        item.itemName &&
        item.quantity > 0 &&
        item.rate > 0
    );


    if (isExistingRowsFilled) {
      setFieldValue('items', [
        ...values.items,
        {
          srNo: values.items.length + 1, itemCode: ' ', itemName: '', quantity: 0, rate: 0, totalAmount: 0
        },
      ]);
    } else {
      alert('Please fill in all fields in the existing rows before adding a new row.');
    }
  };

  const handleRemoveItem = (index) => {
    if (index === 0 && values.items.length === 1) {
      return
    }
    setFieldValue('items', values.items.filter((_, i) => i !== index));
  };

  const calculateTotalSum = () => {
    return values.items.reduce(
      (sum, item) => sum + (parseFloat(item.quantity) * parseFloat(item.rate) || 0),
      0
    ).toFixed(2);
    
  };
  const calculateItemTotalAmount = (quantity, rate) => {
    return (parseFloat(quantity) * parseFloat(rate)).toFixed(2);
  };

  const handleQuantityChange = (value, index) => {
    const newTotalAmount = calculateItemTotalAmount(value, values.items[index].rate);
    setFieldValue(`items.${index}.quantity`, value);
    setFieldValue(`items.${index}.totalAmount`, newTotalAmount);
  };
  
  const handleRateChange = (value, index) => {
    const newTotalAmount = calculateItemTotalAmount(values.items[index].quantity, value);
    setFieldValue(`items.${index}.rate`, value);
    setFieldValue(`items.${index}.totalAmount`, newTotalAmount);
  };

  const onSubmit = (values) => {
    const headerTable = {
      vr_no: values.voucherNo,
      vr_date: values.date,
      ac_name: values.accountName,
      ac_amt: calculateTotalSum(),
      status: values.status,
    };
  
    const detailTable = values.items.map((item) => ({
      vr_no: values.voucherNo,
      sr_no: item.srNo,
      item_code: item.itemCode,
      item_name: item.itemName,
      qty: parseFloat(item.quantity),
      rate: parseFloat(item.rate),
    }));
  
    const transformedData = {
      header_table: headerTable,
      detail_table: detailTable,
    };
  
    console.log('Transformed data:', transformedData);
  
    axios.post('http://5.189.180.8:8010/header/multiple', transformedData)
      .then((response) => {
        console.log('POST request successful:', response.data);
        window.location.reload()
      })
      .catch((error) => {
        console.error('Error while making POST request:', error);
      });
  };
  

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleSubmit,
    handleChange,
    setFieldValue
  } = useFormik({
    initialValues: {
      voucherNo: '',
      date: currentDate,
      accountName: '',
      status: 'A',
      accountAmount: 0,
      items: [{ srNo: 1, itemCode: '', itemName: '', quantity: 0, rate: 0, totalAmount: 0 }],
    },
    validationSchema: formValidation,
    onSubmit: onSubmit,
  });


  return (
    < >
      <form onSubmit={handleSubmit}>
        <div ref={ref} id='container' className="flex flex-col h-screen">
          <div className="h-30 bg-[#5c9ead] flex flex-col items-center justify-center p-14">
            <div className="flex space-x-4 mb-4">

              <div className="flex flex-col">
                <label htmlFor="voucherNo">Vr no</label>
                <input
                  type="text"
                  id="voucherNo"
                  name="voucherNo"
                  className={`border p-2 rounded-md h-8`}
                  value={values.voucherNo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.voucherNo && touched.voucherNo && (
                  <p className="text-red-500 mt-1">{errors.voucherNo}</p>
                )}
              </div>

              <div className="flex flex-col">
                <label htmlFor="date">Date</label>
                <input
                  type="text"
                  id="date"
                  name="date"
                  className={`border p-2 rounded-md h-8`}
                  readOnly
                  value={currentDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.date && touched.date && (
                  <p className="text-red-500 mt-1">{errors.date}</p>
                )}
              </div>

              <div className="flex flex-col">
                <label htmlFor="aiOptions">Status</label>
                <select id="aiOptions" className="border p-2 rounded-md h-9"
                  onChange={(e) => setFieldValue('status', e.target.value)}>
                  <option value="A" >A</option>
                  <option value="I">I</option>
                </select>
                {errors.date && touched.date && (
                  <p className="text-red-500 mt-1">{errors.date}</p>
                )}
              </div>
              <div className="flex flex-col">
                <label htmlFor="accountName">Account Name</label>
                <input
                  type="text"
                  id="accountName"
                  name="accountName"
                  value={values.accountName}
                  className="border p-2 rounded-md h-8 w-48"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.accountName && touched.accountName && (
                  <p className="text-red-500 mt-1">{errors.accountName}</p>
                )}
              </div>

              <div className="flex flex-col">
                <label htmlFor="accountAmount">Account amt</label>
                <input
                  readOnly
                  type="number"
                  id="accountAmount"
                  name="accountAmount"
                  value={calculateTotalSum()}
                  className="border p-2 rounded-md h-8 w-24"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

              </div>

            </div>
          </div>
          <div className="flex-grow bg-[#e0e0e0] p-4">


            <table>
              <thead>
                <tr>
                  <th>Sr No</th>
                  <th>Item Code</th>
                  <th>Item Name</th>
                  <th>Quantity</th>
                  <th>Rate</th>
                  <th>Item Total</th>
                  <th className='hide-on-print'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {values.items.map((item, index) => (
                  <tr key={index} >
                    <td>
                      <input
                        className='h-8 rounded-sm '
                        name={`items.${index}.srNo`}
                        id={`items.${index}.srNo`}
                        value={index + 1}
                        readOnly
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />

                    </td>
                    <td >
                      <Select
                        className='border rounded-md w-36'
                        name={`items.${index}.itemCode`}
                        options={options}
                        value={{ value: item.itemCode, label: item.itemCode, itemName: item.itemName }}
                        onChange={(selectedOption) => handleItemCodeChange(selectedOption.value, index)}
                      />
                    </td>

                    <td>
                      <input
                        type="text"
                        className='h-8 rounded-sm'
                        readOnly
                        name={`items.${index}.itemName`}
                        id={`items.${index}.itemName`}
                        value={item.itemName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </td>

                    <td>
                    <input
    className='h-8 rounded-sm'
    name={`items.${index}.quantity`}
    id={`items.${index}.quantity`}
    type='number'
    value={item.quantity}
    onChange={(e) => handleQuantityChange(e.target.value, index)}
    onBlur={handleBlur}
  />
</td>

<td>
  <input
    className='h-8 rounded-sm'
    name={`items.${index}.rate`}
    id={`items.${index}.rate`}
    type='number'
    value={item.rate}
    onChange={(e) => handleRateChange(e.target.value, index)}
    onBlur={handleBlur}
  />
                    </td>

                    <td>
                      <input
                        className='h-8 rounded-sm'
                        name={`items.${index}.totalAmount`}
                        id={`items.${index}.totalAmount`}
                        type='number'
                        readOnly
                        value={item?.quantity && item.rate && (parseFloat(item.quantity) * parseFloat(item.rate)).toFixed(2)}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </td>

                    <td className='hide-on-print'>
                      <svg onClick={() => handleRemoveItem(index)} xmlns="http://www.w3.org/2000/svg" fill="orange" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 hover:cursor-pointer  ml-3 transition-transform transition-colors transform hover:scale-110 hover:text-red-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button type='button' onClick={handleAddNewRow} className=" hide-on-print bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded-lg ">
              Add Item
            </button>

            <div className='flex justify-end mr-[445px]'>
              <div>
                <div className='hide-on-print'>
                  <span className='font-semibold mr-3'>Total sum</span>
                  <span>
                    <input   
                      className='h-8 rounded-sm p-1'
                      name="accountAmount"
                      id="accountAmount"
                      type='number'
                      readOnly
                      value={calculateTotalSum()}
                    />
                  </span>
                </div>
                <button type='submit' className="hide-on-print bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded-lg mt-2 ml-[14rem]">
                  Save
                </button>
              </div>
            </div>
            <button onClick={handlePrint} className="hide-on-print bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z" />
</svg>

  <span>Print</span>
</button>


          </div>
        </div>
      </form>
    </>
  );
}

export default App;
