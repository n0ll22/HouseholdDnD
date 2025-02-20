import React from "react";
import { MoonLoader } from "react-spinners";

interface Props {
    loading: boolean;
}

const LoadingSpinner: React.FC<Props> = ({ loading }) => {
    return (
        <MoonLoader
            color="red"
            loading={loading}
            size={40}
            aria-label="Loading"
            data-testid="loader"
        />
    );
};

export default LoadingSpinner;
