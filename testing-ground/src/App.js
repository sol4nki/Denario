  // import logo from './logo.svg';
  import './App.css';
  import Fallback from './adaptive-icon.png'

  function App({imageSrc = {Fallback},tokenName = "BITCOIN", nickName = "BTC", cost = 0.001, costinc = 0.001}) {
    return (
      <div className="App">
        <div className='tokenDisplay'>
          <div className='Pic'>
            <img src={Fallback} alt='icon'></img>
          </div>
          <div className='Names'>
            <p style={{ fontSize: '18px', marginTop: '0px' }}>{tokenName}</p>
            <p style={{ fontSize: '18px', opacity: '50%' }}>{nickName}</p>
          </div>
          <div className='filler'>

          </div>
          <div className='Money'>
            <p style={{ fontSize: '16px', marginTop: '0px' }}>${cost}</p>
            <p style={{ fontSize: '14px', color: 'green' }}>{costinc}</p>
          </div>
          
        </div>



        {/* <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header> */}
      </div>
    );
  }

  export default App;
