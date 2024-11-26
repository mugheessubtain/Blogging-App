import React from 'react'

export default function Loading() {
    return (

        <div style={{
            display: "flex",
            width: "100%",
            height: "100vh",
            justifyContent: "center",
            alignContent: "center"
        }}>
            <span className="loading loading-spinner text-info  loading-lg"></span>
        </div>
    );
}


