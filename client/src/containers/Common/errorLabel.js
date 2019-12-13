import React from 'react';

const ErrorLabel = (prop) => {
    return (<h1 className="ui message red block white-text">{prop.error}</h1>
    )
}

export default ErrorLabel;