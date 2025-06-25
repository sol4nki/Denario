// import logo from './logo.svg';
import './Money.css';


function Money({ total = 0.001, change = 0.001, changePercentage = 0.001, DecInc = "+" }) {
return (
    <view className='main'>
    <view className='Total'>
        <p >${total}</p>
    </view>
    <view className='bottomContainer'>
        <view className='left'>
            <p>{DecInc}{change}</p>
        </view>

        <view className='filler'>
            
        </view>

        <view className='right'>
            <p>{DecInc}{changePercentage}%</p>

        </view>
    </view>
    </view>
    
);
}

export default Money;
