import React, { useState, useEffect } from 'react';
import Home from './Home.tsx';
import Edit from './Edit.tsx';

function App() {
    const [queryParams, setQueryParams] = useState({} as { page: string | null });

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const page = params.get('page');
        setQueryParams({ page });
    }, []);

    let Component: () => React.JSX.Element;
    switch (queryParams.page) {
        case 'edit':
            Component = Edit;
            break;
        default:
            Component = Home;
    }
    return (
        <div>
            <Component />
        </div>
    );
}

export default App;
