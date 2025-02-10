import React, { useEffect, useState } from 'react'
import apiService from '../../services/apiService'

export default function Feedback() {
    const [feedbackList, setFeedbackList] = useState();

    useEffect(() => {
        const getFeedbacks = async () => {
            const res = await apiService.get('/api/v1/admin/feedback-list');
            if(res){
                setFeedbackList(res);
            }
        }
        getFeedbacks();
    }, [])
    return (
        <div className='admin-feedback-list-container'>
            {
                feedbackList && feedbackList.length !== 0 ? feedbackList.map((feedback, i) => <div key={i}>
                    <h3>{feedback.name}</h3>
                    <p><small className='tertiary-color'>{Date(feedback.datetime)}</small></p>
                    <p className='secondary-color'>{feedback.message}</p>
                </div>) : ''
            }
        </div>
    )
}
