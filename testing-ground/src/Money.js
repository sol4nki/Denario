// import logo from './logo.svg';
import './Money.css';


function Money({ total = 0.001, change = 0.001, changePercentage = 0.001, DecInc = "+" }) {
return (
    <div className='main'>
    <div className='Total'>
        <p >${total}</p>
    </div>
    <div className='bottomContainer'>
        <div className='left'>
            <p>{DecInc}{change}</p>
        </div>

        <div className='filler'>
            
        </div>

        <div className='right'>
            <p>{DecInc}{changePercentage}%</p>

        </div>
    </div>
    </div>
    
);
}

export default Money;
