import React from 'react';
import Home from './Home.tsx';
import Edit from './Edit.tsx';

function App() {
    let Component;
    switch (window.location.pathname) {
        case '/edit':
            Component = Edit;
            break;
        case '/':
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
