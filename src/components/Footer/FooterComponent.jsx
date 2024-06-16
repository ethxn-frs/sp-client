// src/components/Footer.js
import React from 'react';

const FooterComponent = () => {
    return (
        <footer style={styles.footer}>
            <p>&copy; 2024 My Awesome Website. All rights reserved.</p>
        </footer>
    );
};

const styles = {
    footer: {
        position: 'sticky',
        backgroundColor: '#282c34',
        padding: '10px',
        color: 'white',
        textAlign: 'center',
        width: '100%',
        bottom: 0,
    }
};

export default FooterComponent;