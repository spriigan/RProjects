import React, { useEffect, useState } from 'react';
const Header = () => {
  const listBeforeLogin = ['login', 'register'];
  const windowSize = useWindowSize();
  const listItems = listBeforeLogin.map((title) => (<li className='lg:mr-2 mb-4'><a href="#">{title}</a></li>))
  const searchBar: JSX.Element = (<div className='w-fit md:w-auto text-black p-1 flex rounded-xl bg-white'>
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 bg-white mr-2 md:pt-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
    <input className='focus:outline-none' type="text" />
  </div>);
  const [isCollapsed, setCollapsed] = useState<boolean>(true);
  console.log(isCollapsed);
  return (
    <nav className='bg-colorNavBar py-3 md:flex justify-between'>
      <div className='flex justify-between mx-2 text-white'>
        <h3>Logo</h3>
          <button className='md:hidden hover:bg-gray-300 rounded-lg p-2' onClick={() => setCollapsed(!isCollapsed)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
          </button>
      </div>
      {windowSize && windowSize.width >= 768 ? searchBar : ''}
      <div className={'w-full mx-3 text-white md:block md:w-auto ' + (isCollapsed ? 'hidden' : 'block')}>
        <ul className='md:flex content-center'>
          {listItems}
          {windowSize && windowSize.width < 768 ? searchBar : ''}
        </ul>
      </div>
    </nav>
  )
}

type WindowState = {
  height: number;
  width: number;
}

function useWindowSize(): WindowState | undefined {
  const [windowSize, setWindowSize] = useState<WindowState>()

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        height: window.innerHeight,
        width: window.innerWidth
      })
    }
    window.addEventListener('resize', handleResize);
    handleResize();
    return window.removeEventListener('rezise', handleResize);
  }, [])
  return windowSize;
}

export default Header