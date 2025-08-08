// app/address/page.jsx
'use client'; // required for client components using window/google

import AddressForm from '@/components/googleAddressAutofill'; // adjust path as needed

const AddressPage = () => {
  return (
    <>
      <div style={{ padding: '2rem' }} className="flex items-center h-screen">
        <AddressForm />
      </div>
    </>
  );
};

export default AddressPage;
