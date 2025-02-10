import React, { useEffect, useRef } from 'react'
import '../../styles/smallPagesStyling.css'
import apiService from '../../services/apiService';
import inpServices from '../../services/inputVarifier';

export default function Feedback({hdr}) {
    const validationSmall = useRef();
    const feedbackHandler = async (e) => {
        const target = e.target;
        const form = target.closest('.feedback-form');
        const inputs = form.querySelectorAll('input');
        const textarea = form.querySelector('textarea');
        const list = [...inputs, textarea];
        const {varified, values} = inpServices.varifyInputs(list);

        if(varified){
            target.classList.add('loading');
            const res = await apiService.post('/api/v1/feedback', values);

            if(res){
                inpServices.clearInputs(list);
                target.classList.remove('loading');
            }
        }
    }

    const inpHandler = (e) => {
        const inp = e.target;
        const {value, type} = inp;

        if(type === 'email'){
            if(inpServices.emailVarifier(value) || value === ''){
                inp.style = '';
                validationSmall.current.classList.remove('show');
            }else if(!inpServices.emailVarifier(value) && value !== ''){
                validationSmall.current.classList.add('show');
                inp.style.borderColor = 'var(--warning)';
            }
        }else if(type !== 'email'){
            inp.style = '';
        }
    }

    useEffect(() => {
        hdr(true);
    }, [hdr])
    return (
        <div className='feedback-page-container'>
            <div className="feedback-inner">
                <h3>Tell us about your thoughts</h3>
                <div className="feedback-form">
                    <input type="text" name='name' placeholder='Name' onChange={inpHandler} />
                    <input type="email" name="email" placeholder='Email' onChange={inpHandler} />
                    <small ref={validationSmall}>Please enter a valid email</small>
                    <textarea name="message" placeholder='Start writing...' onChange={inpHandler} ></textarea>
                    <div className="t-center">
                        <button className='sign-anim-btn' onClick={feedbackHandler}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    )
}