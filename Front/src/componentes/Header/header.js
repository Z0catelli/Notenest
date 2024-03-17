import './header.css'
import React from 'react';

function Header() {
    return (
        <div className='header-div'>
            <div className="navbar">
                <div className="months">
                <h1 className="month-name">Dezembro</h1>
                </div>
                <img src="/img/notenest-logo-horizontal.svg" className="logo" alt="Logotipo escrito Notenest com elemento gráfico de uma pena"></img>
            </div>
        </div>
    )
}

export default Header