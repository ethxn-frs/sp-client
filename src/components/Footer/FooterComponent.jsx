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
        bottom: 0,
        width: '100%',
        backgroundColor: '#282c34',
        padding: '10px',
        color: 'white',
        textAlign: 'center'
    }
};

export default FooterComponent;
