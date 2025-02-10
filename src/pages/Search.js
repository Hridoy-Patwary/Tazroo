import React, { useEffect } from 'react'

export default function Search({ hdr }) {
    useEffect(() => {
        hdr(true);
    }, [hdr])
    return (
        <div>Search page</div>
    )
}