const numberFormat = (number) => {
    return new Intl.NumberFormat().format(number)
}
const salePercent = (price,salePrice) =>{
    return Math.round(((price-salePrice)/price)*100);
}
export { numberFormat,salePercent }
