import React, { useRef } from 'react'
import { ReactComponent as TrashIcon } from '../../assets/icons/trash.svg';

export default function Address({ id, addr }) {
  const addrRef = useRef();

  const addrSubmitHandler = (e) => {
    const target = e.target;
    const addrForm = addrRef.current;
    const addrInputs = addrForm.querySelectorAll('input');
    let empty = false;

    if(target.classList.contains('loading')) return;
    const data = {
      id: id,
      addr: {}
    };

    addrInputs.forEach((inp) => {
      if(inp.type !== 'checkbox' && inp.required && inp.value === ''){
        inp.style.border = '1px solid rgb(255, 158, 158)';
        empty = true;
      }else{
        inp.style = '';
        data.addr[inp.name] = inp.type === 'checkbox' ? inp.checked : inp.value;
      }
    });
    if(!empty){
      target.classList.add('loading');
      fetch(process.env.REACT_APP_API_URL + '/api/v1/user/update/addr', {
        method:'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }).then((res) => res.json()).then((data) => {
        if(data.data){
          target.classList.remove('loading');
          addrInputs.forEach((inp) => inp.value = '');
          const x = JSON.parse(localStorage.getItem('ud'));
          if(x && x.id){
            x.address = data.data.address;
            localStorage.setItem('ud', JSON.stringify(x));
          }
          alert(data.message);
        }else{
          alert('error occured while adding address');
        }
      }).catch(err => {
        console.log(err);
      });
    }
  }

  const addrDeleteHandler = (e) => {
    const target = e.target;
    const parent = target.parentElement;

    alert('This address will be removed');
    parent.remove();
  }

  return (
    <div className='tab-container addr-tab'>
      <h3>Add your address</h3>
      <div className="addr-form" ref={addrRef}>
        <input type="text" name='address' placeholder='Address 1' required />
        <input type="text" name='address-optional' placeholder='Address 2 (optional)' />
        <input type="text" name='city' placeholder='City' required />
        <div className="code-and-number">
          <input type="number" name='post-code' placeholder='Post code' required />
          <input type="number" name='phone' placeholder='Number' required />
        </div>
        <div className="df alic">
          <input type="checkbox" name="default-address" />
          <span className='tertiary-color'>Use as default address?</span>
        </div>
        <div className="addr-submit-btn">
          <button className='sign-anim-btn' onClick={addrSubmitHandler}>Submit</button>
        </div>
      </div>
      <div className="addr-list">
        {addr ? addr.map((adr, i) => {
          return <div className='addr-row df alic jstfy-btwn' key={i}>
            <p>{adr.address}</p>
            <button onClick={addrDeleteHandler}>
              <TrashIcon width={20} height={20} />
            </button>
          </div>
        }) : ''}
      </div>
    </div>
  )
}
