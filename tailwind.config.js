/** @type {import('tailwindcss').Config} */
module.exports = {
    theme: {
        extend: {
            aspectRatio: {
                auto: 'auto',
                square: '1 / 1',
                video: '16 / 9'
            },
            colors:{
                mainColor:'',
                secColor:'#222831',
                cosColor:'#FF4C4C',
                darkColor:'#1C1B22'
            }
        }
    }
};