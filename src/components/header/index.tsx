import React from 'react';

function Header() {
  const tabs = [
    { id: 1, name: 'Address Autofill', link: '/' },
    { id: 2, name: 'FreeHand Map', link: '/freehand-map' },
    { id: 3, name: 'DotConnect Draw', link: '/dotConnectPolygonDraw' },
  ];
  return (
    <div className="fixed top-0 bg-yellow-50 p-4 flex w-full gap-4">
      {tabs?.map((ele) => (
        <div key={ele.id} className="flex items-center gap-2 ">
          <a href={ele.link} className='text-sm hover:underline hover:text-blue-700'>{ele.name}</a>
        </div>
      ))}
    </div>
  );
}

export default Header;
