import * as React from "react";

export const ErrorToast = ({ error }: { error: string })=> {
    return (
        <div className="alert alert-danger" role="alert">
            { error }
        </div>
    )
}
