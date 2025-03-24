import React from 'react';
import {PayPalButtons , PayPalScriptProvider } from "@paypal/react-paypal-js";

const PayPalButton = ({amount , onSuccess , onError} ) => {
  return(
   <PayPalScriptProvider options={{"client-id":
     "AQQ4csLLNX8jK2tPJ_EIgYSsOdLW60S34ymSu2qeBt_ujkXrQIOB3HwgByrKq_XTPkAtQ7UVUA0mGL_5"}}>

        <PayPalButtons style={{layout:"vertical"}}
        createOrder={(data, actions) => {
            return actions.order.create({
                purchase_units: [{amount: {value:amount}}]
            })
        }}
        onApprove={(data,actions)=>{
            return actions.order.capture().then(onSuccess)
        }}
        onError={onError} />

     </PayPalScriptProvider>
    
    )
}


export default PayPalButton